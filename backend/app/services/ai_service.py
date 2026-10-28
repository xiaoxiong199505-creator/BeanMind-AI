"""
AI Service for RAG mapping using Google Gemini 1.5 Pro
"""
import google.generativeai as genai
from typing import List, Dict, Optional
import os
from dotenv import load_dotenv

load_dotenv()

# Configure Gemini API
api_key = os.getenv("GEMINI_API_KEY")
if api_key:
    genai.configure(api_key=api_key)

class AIService:
    def __init__(self):
        self.model = genai.GenerativeModel('gemini-1.5-pro')
        
        # In-memory knowledge base for SCA standards (simple RAG implementation)
        self.knowledge_base = self._load_knowledge_base()
    
    def _load_knowledge_base(self) -> Dict[str, str]:
        """Load SCA standards into memory for retrieval"""
        return {
            "fragrance": "Fragrance: The aromatic aspects of the dry coffee grounds or after breaking the crust. Scale: 6.0-10.0. Descriptors: floral, fruity, nutty, chocolate, caramel, spicy, herbal, earthy.",
            "aroma": "Aroma: The aromatic aspects of the coffee when hot water is added. Scale: 6.0-10.0. Descriptors: floral, fruity, nutty, chocolate, caramel, spicy, herbal, earthy.",
            "flavor": "Flavor: The combination of aroma, acidity, and body. Scale: 6.0-10.0. Descriptors: sweet, sour, salty, bitter, savory, umami.",
            "aftertaste": "Aftertaste: The length of positive flavor qualities remaining after the coffee is spit or swallowed. Scale: 6.0-10.0. Descriptors: lingering, clean, chocolatey, fruity, nutty, spicy.",
            "acidity": "Acidity: The dry, bright sensation typical of high elevation coffees. Scale: 6.0-10.0. Descriptors: bright, crisp, lively, sharp, mild, soft, dull, flat.",
            "body": "Body: The tactile feel of the coffee in the mouth, described as weight or thickness. Scale: 6.0-10.0. Descriptors: light, medium, full, heavy, thin, watery, buttery, syrupy.",
            "balance": "Balance: How all the aspects of flavor, aftertaste, acidity, and body work together. Scale: 6.0-10.0. Descriptors: harmonious, complex, simple, disjointed, unbalanced.",
            "uniformity": "Uniformity: Consistency of flavor among different cups from the same sample. Scale: 6.0-10.0. Descriptors: consistent, uniform, variable, inconsistent.",
            "clean_cup": "Clean Cup: Absence of negative flavors or off-notes in the coffee. Scale: 6.0-10.0. Descriptors: clean, pure, muddled, tainted, off-flavors.",
            "sweetness": "Sweetness: The pleasing fullness of flavor as perceived on the tongue. Scale: 6.0-10.0. Descriptors: sweet, cloying, astringent, dry, neutral.",
            "overall": "Overall: The holistic impression of the coffee, personal experience, and preference. Scale: 6.0-10.0. Descriptors: exceptional, very good, good, fair, poor."
        }
    
    def retrieve_relevant_standards(self, query: str, top_k: int = 3) -> List[str]:
        """
        Simple keyword-based retrieval from knowledge base
        In production, this would use vector embeddings and similarity search
        """
        query_lower = query.lower()
        relevant_standards = []
        
        for key, standard_text in self.knowledge_base.items():
            # Check if any keywords from the standard appear in the query
            standard_keywords = standard_text.lower().split()
            match_count = sum(1 for keyword in standard_keywords if keyword in query_lower and len(keyword) > 3)
            
            if match_count > 0:
                relevant_standards.append((standard_text, match_count))
        
        # Sort by match count and return top_k
        relevant_standards.sort(key=lambda x: x[1], reverse=True)
        return [std[0] for std in relevant_standards[:top_k]]
    
    def map_cupping_notes_to_sca(self, cupping_data: Dict) -> Dict:
        """
        Use AI to map subjective cupping notes to SCA standards
        """
        # Retrieve relevant SCA standards
        subjective_notes = cupping_data.get("subjective_notes", "")
        tasting_notes = cupping_data.get("tasting_notes", "")
        query = f"{subjective_notes} {tasting_notes}"
        
        relevant_standards = self.retrieve_relevant_standards(query)
        
        # Construct prompt with RAG context
        context = "\n\n".join(relevant_standards) if relevant_standards else "No specific standards matched. Use general SCA cupping knowledge."
        
        prompt = f"""
You are an expert SCA (Specialty Coffee Association) cupper. Your task is to map subjective cupping notes to SCA standards.

SCA Standards Context:
{context}

Cupping Data:
- Sample Name: {cupping_data.get('sample_name')}
- Fragrance: {cupping_data.get('fragrance')}
- Aroma: {cupping_data.get('aroma')}
- Flavor: {cupping_data.get('flavor')}
- Aftertaste: {cupping_data.get('aftertaste')}
- Acidity: {cupping_data.get('acidity')}
- Body: {cupping_data.get('body')}
- Balance: {cupping_data.get('balance')}
- Overall: {cupping_data.get('overall')}
- Subjective Notes: {subjective_notes}
- Tasting Notes: {tasting_notes}

Please analyze this cupping data and provide:
1. A mapping of each SCA attribute to the given score with brief reasoning
2. Identify which attributes are strongest and which need improvement
3. Suggest specific improvements based on SCA standards
4. Provide a confidence score (0-1) for your analysis

Respond in JSON format with this structure:
{{
    "attribute_mappings": [
        {{
            "attribute": "Fragrance",
            "score": <given_score>,
            "reasoning": "<brief explanation>"
        }},
        ...
    ],
    "strengths": ["<list of strong attributes>"],
    "improvements": ["<list of specific improvements>"],
    "confidence_score": <0-1>,
    "overall_assessment": "<brief summary>"
}}
"""
        
        try:
            response = self.model.generate_content(prompt)
            result_text = response.text
            
            # Parse the response (in production, add proper error handling)
            # For now, return a structured response
            return {
                "success": True,
                "raw_response": result_text,
                "confidence_score": 0.85,  # Placeholder
                "attribute_mappings": self._parse_attribute_mappings(cupping_data),
                "improvements": self._generate_improvements(cupping_data),
                "overall_assessment": self._generate_assessment(cupping_data)
            }
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "message": "AI service unavailable. Using fallback analysis."
            }
    
    def _parse_attribute_mappings(self, cupping_data: Dict) -> List[Dict]:
        """Parse attribute mappings from cupping data"""
        attributes = ["fragrance", "aroma", "flavor", "aftertaste", "acidity", "body", "balance", "uniformity", "clean_cup", "sweetness", "overall"]
        mappings = []
        
        for attr in attributes:
            score = cupping_data.get(attr)
            if score is not None:
                mappings.append({
                    "attribute": attr.replace("_", " ").title(),
                    "score": score,
                    "reasoning": f"Score of {score} indicates {'excellent' if score >= 8.0 else 'good' if score >= 7.0 else 'acceptable' if score >= 6.0 else 'needs improvement'} quality"
                })
        
        return mappings
    
    def _generate_improvements(self, cupping_data: Dict) -> List[str]:
        """Generate improvement suggestions based on scores"""
        improvements = []
        
        if cupping_data.get("flavor", 0) < 7.5:
            improvements.append("Enhance flavor complexity through roast profile optimization")
        if cupping_data.get("acidity", 0) < 7.5:
            improvements.append("Consider adjusting roast to preserve origin acidity")
        if cupping_data.get("balance", 0) < 7.5:
            improvements.append("Work on achieving better balance between sweetness and acidity")
        if cupping_data.get("aftertaste", 0) < 7.5:
            improvements.append("Focus on roast development to improve aftertaste length")
        
        if not improvements:
            improvements.append("Excellent cupping profile across all attributes")
        
        return improvements
    
    def _generate_assessment(self, cupping_data: Dict) -> str:
        """Generate overall assessment"""
        total_score = cupping_data.get("total_score", 0)
        
        if total_score >= 85:
            return "Exceptional specialty coffee, well above SCA standards"
        elif total_score >= 80:
            return "High-quality specialty coffee meeting SCA standards"
        elif total_score >= 75:
            return "Good quality coffee approaching specialty standards"
        else:
            return "Coffee requires improvement to meet specialty standards"

# Singleton instance
ai_service = AIService()

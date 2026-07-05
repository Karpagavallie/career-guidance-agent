const { generateContent, parseJSONResponse } = require('./geminiService');
const { buildCareerPrompt } = require('../prompts/careerPrompt');
const { buildSkillGapPrompt } = require('../prompts/skillGapPrompt');
const { buildRoadmapPrompt } = require('../prompts/roadmapPrompt');
const { buildCertificationPrompt } = require('../prompts/certificationPrompt');
const { buildInterviewPrompt } = require('../prompts/interviewPrompt');
const { buildAdvicePrompt } = require('../prompts/advicePrompt');

/**
 * AI Career Agent
 * ----------------
 * This is the "agent brain" of the application. Given a student's profile,
 * it decides which modules to run, executes them in the correct order
 * (each step's output feeds the next step's input), and combines all
 * results into one final career guidance report object.
 *
 * Modules orchestrated:
 * 1. Profile Analysis + Career Recommendation
 * 2. Skill Gap Analysis
 * 3. Learning Roadmap
 * 4. Certification Recommendation
 * 5. Interview Question Generator
 * 6. Career Report Generator (final assembly)
 */
const runCareerAgent = async (profile) => {
  // Step 1: Profile Analysis + Career Recommendation
  const careerPrompt = buildCareerPrompt(profile);
  const careerRaw = await generateContent(careerPrompt);
  const careerData = parseJSONResponse(careerRaw);
  const { profileSummary, recommendedCareer, reasoning } = careerData;

  // Step 2: Skill Gap Analysis (depends on recommended career)
  const skillGapPrompt = buildSkillGapPrompt(profile, recommendedCareer);
  const skillGapRaw = await generateContent(skillGapPrompt);
  const skillGapData = parseJSONResponse(skillGapRaw);

  // Step 3: Learning Roadmap (depends on skills to learn)
  const roadmapPrompt = buildRoadmapPrompt(recommendedCareer, skillGapData.skillsToLearn || []);
  const learningRoadmap = await generateContent(roadmapPrompt);

  // Step 4: Certification Recommendation (depends on skills to learn)
  const certificationPrompt = buildCertificationPrompt(recommendedCareer, skillGapData.skillsToLearn || []);
  const certificationRecommendation = await generateContent(certificationPrompt);

  // Step 5: Interview Question Generator (depends on recommended career)
  const interviewPrompt = buildInterviewPrompt(recommendedCareer, profile);
  const interviewRaw = await generateContent(interviewPrompt);
  const interviewQuestions = parseJSONResponse(interviewRaw);

  // Step 6: Final Career Advice (closing message)
  const advicePrompt = buildAdvicePrompt(profile, recommendedCareer);
  const finalCareerAdvice = await generateContent(advicePrompt);

  // Step 7: Career Report Generator - combine everything into one report object
  const report = {
    profileSummary: `${profileSummary} ${reasoning ? `\n\nWhy this career fits: ${reasoning}` : ''}`.trim(),
    recommendedCareer,
    skillGapAnalysis: {
      existingSkills: skillGapData.existingSkills || [],
      missingSkills: skillGapData.missingSkills || [],
      skillsToLearn: skillGapData.skillsToLearn || [],
    },
    learningRoadmap: learningRoadmap.trim(),
    certificationRecommendation: certificationRecommendation.trim(),
    interviewQuestions: {
      technical: interviewQuestions.technical || [],
      hr: interviewQuestions.hr || [],
    },
    finalCareerAdvice: finalCareerAdvice.trim(),
  };

  return report;
};

module.exports = { runCareerAgent };

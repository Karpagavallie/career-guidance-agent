// Fetches a career report by ID (from the URL query string) and renders it.

const reportContainer = document.getElementById('reportContainer');

const getReportIdFromURL = () => {
  const params = new URLSearchParams(window.location.search);
  return params.get('id');
};

const renderTagList = (items, className = '') => {
  if (!items || items.length === 0) return '<p style="color:var(--muted); font-size:0.85rem;">None listed</p>';
  return `<div class="tag-list">${items.map((item) => `<span class="tag ${className}">${escapeHTML(item)}</span>`).join('')}</div>`;
};

const renderQuestionList = (items) => {
  if (!items || items.length === 0) return '<p style="color:var(--muted); font-size:0.85rem;">None available</p>';
  return `<ul class="question-list">${items.map((q) => `<li>${escapeHTML(q)}</li>`).join('')}</ul>`;
};

const escapeHTML = (str) => {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
};

const renderReport = (report) => {
  const { user, profileSummary, recommendedCareer, skillGapAnalysis, learningRoadmap,
    certificationRecommendation, interviewQuestions, finalCareerAdvice, generatedAt } = report;

  const dateStr = new Date(generatedAt || report.createdAt).toLocaleString();

  reportContainer.innerHTML = `
    <div class="report-section">
      <h2>Profile Summary</h2>
      <p>${escapeHTML(profileSummary)}</p>
      <p style="margin-top:10px; font-size:0.8rem; color:var(--muted);">Generated on ${dateStr}${user ? ` for ${escapeHTML(user.name)}` : ''}</p>
    </div>

    <div class="report-section">
      <h2>Recommended Career</h2>
      <p><strong>${escapeHTML(recommendedCareer)}</strong></p>
    </div>

    <div class="report-section">
      <h2>Skill Gap Analysis</h2>
      <div class="skill-columns">
        <div>
          <h4>Existing Skills</h4>
          ${renderTagList(skillGapAnalysis.existingSkills)}
        </div>
        <div>
          <h4>Missing Skills</h4>
          ${renderTagList(skillGapAnalysis.missingSkills, 'missing')}
        </div>
        <div>
          <h4>Skills to Learn</h4>
          ${renderTagList(skillGapAnalysis.skillsToLearn, 'learn')}
        </div>
      </div>
    </div>

    <div class="report-section">
      <h2>Learning Roadmap</h2>
      <pre>${escapeHTML(learningRoadmap)}</pre>
    </div>

    <div class="report-section">
      <h2>Certification Recommendation</h2>
      <pre>${escapeHTML(certificationRecommendation)}</pre>
    </div>

    <div class="report-section">
      <h2>Interview Questions</h2>
      <h4 style="margin-bottom:6px; color:var(--muted); font-size:0.85rem; text-transform:uppercase;">Technical</h4>
      ${renderQuestionList(interviewQuestions.technical)}
      <h4 style="margin:14px 0 6px; color:var(--muted); font-size:0.85rem; text-transform:uppercase;">HR</h4>
      ${renderQuestionList(interviewQuestions.hr)}
    </div>

    <div class="report-section">
      <h2>Final Career Advice</h2>
      <p>${escapeHTML(finalCareerAdvice)}</p>
    </div>

    <div style="text-align:center; margin: 24px 0;">
      <a href="/form.html" class="btn secondary">Generate Another Report</a>
      <a href="/history.html" class="btn" style="margin-left:12px;">View History</a>
    </div>
  `;
};

const loadReport = async () => {
  const id = getReportIdFromURL();
  if (!id) {
    reportContainer.innerHTML = '<div class="empty-state"><p>No report ID provided.</p></div>';
    return;
  }

  try {
    const response = await fetch(`/api/career/report/${id}`);
    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Failed to load report.');
    }

    renderReport(result.data);
  } catch (error) {
    reportContainer.innerHTML = `<div class="empty-state"><p>${escapeHTML(error.message)}</p></div>`;
  }
};

loadReport();

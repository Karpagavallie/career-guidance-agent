// Fetches all previously generated career reports and renders them as a list.

const historyList = document.getElementById('historyList');

const escapeHTML = (str) => {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
};

const renderHistory = (reports) => {
  if (!reports || reports.length === 0) {
    historyList.innerHTML = `
      <div class="empty-state">
        <p>No reports generated yet.</p>
        <a href="/form.html" class="btn" style="margin-top:16px; display:inline-block;">Generate Your First Report</a>
      </div>
    `;
    return;
  }

  historyList.innerHTML = reports
    .map((report) => {
      const dateStr = new Date(report.generatedAt || report.createdAt).toLocaleString();
      const userName = report.user ? escapeHTML(report.user.name) : 'Unknown';
      return `
        <div class="history-item">
          <div class="info">
            <h3>${userName} &mdash; ${escapeHTML(report.recommendedCareer)}</h3>
            <p>Generated on ${dateStr}</p>
          </div>
          <a href="/report.html?id=${report._id}" class="btn secondary">View Report</a>
        </div>
      `;
    })
    .join('');
};

const loadHistory = async () => {
  try {
    const response = await fetch('/api/career/history');
    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Failed to load history.');
    }

    renderHistory(result.data);
  } catch (error) {
    historyList.innerHTML = `<div class="empty-state"><p>${escapeHTML(error.message)}</p></div>`;
  }
};

loadHistory();

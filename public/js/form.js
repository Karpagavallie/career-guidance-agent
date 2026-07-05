// Handles the career guidance form submission, client-side validation,
// loading indicator, and redirect to the report page on success.

const careerForm = document.getElementById('careerForm');
const errorBanner = document.getElementById('errorBanner');
const loadingOverlay = document.getElementById('loadingOverlay');
const submitBtn = document.getElementById('submitBtn');

const showError = (message) => {
  errorBanner.textContent = message;
  errorBanner.style.display = 'block';
};

const hideError = () => {
  errorBanner.style.display = 'none';
  errorBanner.textContent = '';
};

const setLoading = (isLoading) => {
  if (isLoading) {
    careerForm.style.display = 'none';
    loadingOverlay.style.display = 'flex';
  } else {
    careerForm.style.display = 'block';
    loadingOverlay.style.display = 'none';
  }
};

careerForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  hideError();

  const formData = new FormData(careerForm);
  const payload = {
    name: formData.get('name').trim(),
    email: formData.get('email').trim(),
    education: formData.get('education').trim(),
    department: formData.get('department').trim(),
    currentSkills: formData.get('currentSkills').trim(),
    interests: formData.get('interests').trim(),
    careerGoal: formData.get('careerGoal').trim(),
  };

  // Basic client-side validation
  if (!payload.name || payload.name.length < 2) {
    return showError('Please enter a valid name.');
  }
  const emailRegex = /^\S+@\S+\.\S+$/;
  if (!emailRegex.test(payload.email)) {
    return showError('Please enter a valid email address.');
  }
  if (!payload.education) {
    return showError('Please enter your education.');
  }
  if (!payload.department) {
    return showError('Please enter your department.');
  }
  if (!payload.careerGoal) {
    return showError('Please enter your career goal.');
  }

  setLoading(true);
  submitBtn.disabled = true;

  try {
    const response = await fetch('/api/career/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      const message = result.errors ? result.errors.join(' ') : result.message || 'Something went wrong.';
      throw new Error(message);
    }

    // Save the report ID and redirect to the report page
    window.location.href = `/report.html?id=${result.data._id}`;
  } catch (error) {
    setLoading(false);
    submitBtn.disabled = false;
    showError(error.message || 'Failed to generate career report. Please try again.');
  }
});

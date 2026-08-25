// Render a Bootstrap alert.
function showAlert(containerSelector, message, type) {
  type = type || "danger";
  $(containerSelector).html(
    `<div class="form-alert alert alert-${type}" role="alert">${message}</div>`
  );
}

function clearAlert(containerSelector) {
  $(containerSelector).empty();
}

// Show a spinner while an AJAX request runs.
function withButtonSpinner(buttonSelector, loadingText, ajaxPromiseFn) {
  const $btn = $(buttonSelector);
  const originalHtml = $btn.html();
  $btn.prop("disabled", true).html(
    `<span class="spinner-border spinner-border-sm"></span>${loadingText}`
  );

  return ajaxPromiseFn().always(function () {
    $btn.prop("disabled", false).html(originalHtml);
  });
}

// Redirect to login if the session has expired.
function requireSession(onSuccess) {
  $.get("/api/auth/me")
    .done(function (user) {
      onSuccess(user);
    })
    .fail(function () {
      window.location.href = "/";
    });
}

function logout() {
  $.post("/api/auth/logout").always(function () {
    window.location.href = "/";
  });
}

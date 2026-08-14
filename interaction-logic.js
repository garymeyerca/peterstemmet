export const getFocusWrapTarget = (activeElement, focusableElements, shiftKey) => {
  if (focusableElements.length === 0) return null;

  const firstElement = focusableElements[0];
  const lastElement = focusableElements.at(-1);

  if (!focusableElements.includes(activeElement)) return firstElement;
  if (shiftKey && activeElement === firstElement) return lastElement;
  if (!shiftKey && activeElement === lastElement) return firstElement;
  return null;
};

export const buildInquiryMailto = (action, { name, email, organisation, service, message }) => {
  const subject = encodeURIComponent(`Website inquiry: ${service}`);
  const body = encodeURIComponent(
    `Hi Peter,\n\n${message}\n\nService: ${service}\nName: ${name}\nEmail: ${email}\nOrganisation: ${organisation}`,
  );

  return `${action}?subject=${subject}&body=${body}`;
};

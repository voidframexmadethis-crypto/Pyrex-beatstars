
// utils/downloadHandler.ts
export function handleDownloadTrigger(track: any) {
  const agreementCheckbox = document.getElementById('agree-contract-checkbox') as HTMLInputElement | null;

  if (!agreementCheckbox || !agreementCheckbox.checked) {
    alert("Please check the box to agree to the license terms before downloading.");
    return;
  }

  // Forces the direct download of your .m4a file from the Internet Archive backbone
  const anchor = document.createElement('a');
  anchor.href = track.audioUrl;
  anchor.download = `${track.title}.m4a`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
}

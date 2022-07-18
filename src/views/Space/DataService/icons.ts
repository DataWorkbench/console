const icons = `
<svg   
  aria-hidden="true"
  style="position: absolute; width: 0; height: 0; overflow: hidden;"
  xmlns="http://www.w3.org/2000/svg"
  xmlns:xlink="http://www.w3.org/1999/xlink"
xmlns="http://www.w3.org/2000/svg">

  <symbol id="lego-ui-icon-q-closeCircleFill" viewBox="0 0 48 48">
     <path fill-rule="evenodd" clip-rule="evenodd" d="M24 44C35.0457 44 44 35.0457 44 24C44 12.9543 35.0457 4 24 4C12.9543 4 4 12.9543 4 24C4 35.0457 12.9543 44 24 44ZM21.1716 23.9999L14.5858 30.5857L17.4142 33.4141L24 26.8283L30.5858 33.4141L33.4142 30.5857L26.8285 23.9999L33.4142 17.4141L30.5858 14.5857L24 21.1715L17.4142 14.5857L14.5858 17.4141L21.1716 23.9999Z" fill="currentColor"></path>
  </symbol>
  
 <symbol id="lego-ui-icon-q-mergeFillDuotone" viewBox="0 0 48 48">
    <path d="M21 11L31 3V19L21 11Z" fill="currentColor"></path>
    <path d="M18 37C18 40.866 14.866 44 11 44C7.13401 44 4 40.866 4 37C4 33.134 7.13401 30 11 30C14.866 30 18 33.134 18 37Z"></path>
    <path fill-rule="evenodd" clip-rule="evenodd" d="M44 37C44 40.866 40.866 44 37 44C33.134 44 30 40.866 30 37C30 33.134 33.134 30 37 30C40.866 30 44 33.134 44 37ZM40 37C40 38.6569 38.6569 40 37 40C35.3431 40 34 38.6569 34 37C34 35.3431 35.3431 34 37 34C38.6569 34 40 35.3431 40 37Z"></path>
    <path d="M18 11C18 14.171 15.8915 16.8496 13 17.7101V30.2899C12.3663 30.1013 11.695 30 11 30C10.305 30 9.63371 30.1013 9 30.2899V17.7101C6.10851 16.8496 4 14.171 4 11C4 7.13401 7.13401 4 11 4C14.866 4 18 7.13401 18 11Z" fill="currentColor"></path>
    <path d="M31 9V13H35V30.2899C35.6337 30.1013 36.305 30 37 30C37.695 30 38.3663 30.1013 39 30.2899V11C39 9.89543 38.1046 9 37 9H31Z" fill="currentColor"></path>
  </symbol>
  
  
  <symbol id="lego-ui-icon-q-noteFill" viewBox="0 0 48 48" >
  <path d="M8 6C8 4.89543 8.89543 4 10 4H27V17H40V42C40 43.1046 39.1046 44 38 44H10C8.89543 44 8 43.1046 8 42V6Z" fill="currentColor"></path>
  <path d="M40 14H30V4L40 14Z" fill="currentColor"></path>
  </symbol>
  
  <symbol id="lego-ui-icon-q-noteGearFill" viewBox="0 0 48 48" >
  <path fill-rule="evenodd" clip-rule="evenodd" d="M8 6C8 4.89543 8.89543 4 10 4H38C39.1046 4 40 4.89543 40 6V21.1529C39.3481 21.0522 38.6801 21 38 21C30.8203 21 25 26.8203 25 34C25 38.0209 26.8255 41.6154 29.6929 44H10C8.89543 44 8 43.1046 8 42V6ZM14 18H22V22H14V18ZM28 10H14V14H28V10Z" fill="currentColor"></path>
  <path fill-rule="evenodd" clip-rule="evenodd" d="M35.6267 24L35.1258 26.5234C34.2905 26.8338 33.5182 27.2674 32.84 27.8145L30.3733 26.9785L28 31.0215L29.9738 32.707C29.9038 33.129 29.8585 33.5586 29.8585 34C29.8585 34.4414 29.9038 34.871 29.9738 35.293L28 36.9785L30.3733 41.0215L32.84 40.1856C33.5182 40.7326 34.2905 41.1662 35.1258 41.4766L35.6267 44H40.3733L40.8742 41.4766C41.7095 41.1662 42.4818 40.7326 43.16 40.1856L45.6267 41.0215L48 36.9785L46.0262 35.293C46.0962 34.871 46.1415 34.4414 46.1415 34C46.1415 33.5586 46.0962 33.129 46.0262 32.707L48 31.0215L45.6267 26.9785L43.16 27.8145C42.4818 27.2674 41.7095 26.8338 40.8742 26.5234L40.3733 24H35.6267ZM41.3334 33.9998C41.3334 35.8408 39.841 37.3332 38 37.3332C36.1591 37.3332 34.6667 35.8408 34.6667 33.9998C34.6667 32.1589 36.1591 30.6665 38 30.6665C39.841 30.6665 41.3334 32.1589 41.3334 33.9998Z" fill="currentColor"></path>
  </symbol>
  
  
  <symbol id="lego-ui-icon-q-networkFill" viewBox="0 0 48 48" fill="none"><path d="M30.3369 32C29.8659 34.7173 29.1677 37.1173 28.3199 39.0673C27.5129 40.9233 26.6293 42.236 25.8006 43.0422C24.9858 43.8348 24.3815 44 24 44C23.6185 44 23.0142 43.8348 22.1994 43.0422C21.3707 42.236 20.4871 40.9233 19.6801 39.0673C18.8323 37.1173 18.1341 34.7173 17.6631 32H30.3369Z" fill="currentColor"></path><path d="M33.3785 32C32.6307 36.6357 31.2518 40.5662 29.4818 43.2394C35.2557 41.5975 39.9649 37.4264 42.3358 32H33.3785Z" fill="currentColor"></path><path d="M18.5182 43.2394C12.7443 41.5975 8.03509 37.4264 5.66418 32H14.6215C15.3693 36.6357 16.7482 40.5662 18.5182 43.2394Z" fill="currentColor"></path><path d="M17.2517 29H30.7483C30.9119 27.4064 31 25.7326 31 24C31 22.2674 30.9119 20.5936 30.7483 19H17.2517C17.0881 20.5936 17 22.2674 17 24C17 25.7326 17.0881 27.4064 17.2517 29Z" fill="currentColor"></path><path d="M14.237 19C14.0818 20.6097 14 22.2829 14 24C14 25.7171 14.0818 27.3903 14.237 29H4.63009C4.21877 27.4019 4 25.7265 4 24C4 22.2735 4.21876 20.5981 4.63009 19H14.237Z" fill="currentColor"></path><path d="M17.6631 16H30.3369C29.8659 13.2827 29.1677 10.8827 28.3199 8.93272C27.5129 7.07666 26.6293 5.76402 25.8006 4.9578C24.9858 4.16519 24.3815 4 24 4C23.6185 4 23.0142 4.16519 22.1994 4.9578C21.3707 5.76402 20.4871 7.07666 19.6801 8.93272C18.8323 10.8827 18.1341 13.2827 17.6631 16Z" fill="currentColor"></path><path d="M18.5182 4.76057C16.7482 7.43381 15.3693 11.3643 14.6215 16H5.66417C8.03509 10.5736 12.7443 6.40254 18.5182 4.76057Z" fill="currentColor"></path><path d="M29.4818 4.76057C31.2518 7.43381 32.6307 11.3643 33.3785 16H42.3358C39.9649 10.5736 35.2557 6.40254 29.4818 4.76057Z" fill="currentColor"></path><path d="M33.763 19H43.3699C43.7812 20.5981 44 22.2735 44 24C44 25.7265 43.7812 27.4019 43.3699 29H33.763C33.9182 27.3903 34 25.7171 34 24C34 22.2829 33.9182 20.6097 33.763 19Z" fill="currentColor"></path></symbol>
  <symbol id="lego-ui-icon-q-folderSettingFill" viewBox="0 0 48 48" fill="none"><path d="M27 26C27 27.6569 25.6569 29 24 29C22.3431 29 21 27.6569 21 26C21 24.3431 22.3431 23 24 23C25.6569 23 27 24.3431 27 26Z" fill="currentColor"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M6 6C4.89543 6 4 6.89543 4 8V40C4 41.1046 4.89543 42 6 42H42C43.1046 42 44 41.1046 44 40V12C44 10.8954 43.1046 10 42 10H24L19 6H6ZM22.1014 18L21.7007 20.0187C21.0324 20.267 20.4146 20.6139 19.872 21.0516L17.8986 20.3828L16 23.6172L17.579 24.9656C17.523 25.3032 17.4868 25.6469 17.4868 26C17.4868 26.3531 17.523 26.6968 17.579 27.0344L16 28.3828L17.8986 31.6172L19.872 30.9484C20.4146 31.3861 21.0324 31.733 21.7007 31.9813L22.1014 34H25.8986L26.2993 31.9813C26.9676 31.733 27.5854 31.3861 28.128 30.9484L30.1014 31.6172L32 28.3828L30.421 27.0344C30.477 26.6968 30.5132 26.3531 30.5132 26C30.5132 25.6469 30.477 25.3032 30.421 24.9656L32 23.6172L30.1014 20.3828L28.128 21.0516C27.5854 20.6139 26.9676 20.267 26.2993 20.0187L25.8986 18H22.1014Z" fill="currentColor"></path></symbol> 

  <symbol id="lego-ui-icon-q-rmbCircleFill" viewBox="0 0 48 48" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M24 44C35.0457 44 44 35.0457 44 24C44 12.9543 35.0457 4 24 4C12.9543 4 4 12.9543 4 24C4 35.0457 12.9543 44 24 44ZM26.1914 15.49L24 21.572L21.8086 15.49H17.6133L21.2109 23.8572H18.3516V26.0837H21.9023V27.2556H18.3516V29.4705H21.9023V32.5525H26.0039V29.4705H29.1914V27.2556H26.0039V26.0837H29.1914V23.8572H26.7891L30.375 15.49H26.1914Z" fill="currentColor"></path></symbol>

  <symbol id="lego-ui-icon-q-terminalBoxFill" viewBox="0 0 48 48" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M4 10C4 8.89543 4.89543 8 6 8H42C43.1046 8 44 8.89543 44 10V38C44 39.1046 43.1046 40 42 40H6C4.89543 40 4 39.1046 4 38V10ZM17.6716 24.4999L11.5858 18.4141L14.4142 15.5857L23.3285 24.4999L14.4142 33.4141L11.5858 30.5857L17.6716 24.4999ZM36 29H24V33H36V29Z" fill="currentColor"></path></symbol>

  <symbol id="lego-ui-icon-q-loadingCircleFill" viewBox="0 0 48 48" fill="none"><path d="M36 24C36 25.1 35.1 26 34 26C32.9 26 32 25.1 32 24C32 18.5 27.5 14 22 14C16.5 14 12 18.5 12 24C12 22.9 12.9 22 14 22C15.1 22 16 22.9 16 24C16 29.5 20.5 34 26 34C31.5 34 36 29.5 36 24Z" fill="currentColor"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M44 24C44 35.0457 35.0457 44 24 44C12.9543 44 4 35.0457 4 24C4 12.9543 12.9543 4 24 4C35.0457 4 44 12.9543 44 24ZM24 12C17.4 12 12 17.4 12 24C12 30.6 17.4 36 24 36C30.6 36 36 30.6 36 24C36 17.4 30.6 12 24 12Z" fill="currentColor"></path></symbol>

  <symbol id="lego-ui-icon-q-bellLightningFill" viewBox="0 0 48 48" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M24 2C22.3431 2 21 3.34315 21 5V7.29778C14.0915 8.68929 8.88889 14.7926 8.88889 22.1111V32.3529L7 38H41L39.1111 32.3529V22.1111C39.1111 14.7926 33.9085 8.68929 27 7.29778V5C27 3.34315 25.6569 2 24 2ZM25.5 14V22.25H30L22.5 32V23.75H18L25.5 14Z" fill="currentColor"></path><path d="M17.2898 41C18.1503 43.8915 20.8289 46 23.9999 46C27.1709 46 29.8495 43.8915 30.71 41H17.2898Z" fill="currentColor"></path></symbol> 

  <symbol id="lego-ui-icon-q-downloadBoxFill" viewBox="0 0 48 48" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M12.1085 6C11.4189 6 10.778 6.35524 10.4125 6.94L6 14V40C6 41.1046 6.89543 42 8 42H40C41.1046 42 42 41.1046 42 40V14L37.5875 6.94C37.222 6.35524 36.5811 6 35.8915 6H12.1085ZM37.5 14H10.5L13 10H35L37.5 14ZM22 20H26V28H31L24 36L17 28H22V20Z" fill="currentColor"></path></symbol>

  <symbol id="lego-ui-icon-q-listViewFill" viewBox="0 0 48 48" fill="none"><path d="M8 6C6.89543 6 6 6.89543 6 8V14C6 15.1046 6.89543 16 8 16H18C19.1046 16 20 15.1046 20 14V8C20 6.89543 19.1046 6 18 6H8Z" fill="currentColor"></path><path d="M42 9H24V13H42V9Z" fill="currentColor"></path><path d="M6 21C6 19.8954 6.89543 19 8 19H18C19.1046 19 20 19.8954 20 21V27C20 28.1046 19.1046 29 18 29H8C6.89543 29 6 28.1046 6 27V21Z" fill="currentColor"></path><path d="M42 22H24V26H42V22Z" fill="currentColor"></path><path d="M6 34C6 32.8954 6.89543 32 8 32H18C19.1046 32 20 32.8954 20 34V40C20 41.1046 19.1046 42 18 42H8C6.89543 42 6 41.1046 6 40V34Z" fill="currentColor"></path><path d="M42 35H24V39H42V35Z" fill="currentColor"></path></symbol>
  <symbol id="lego-ui-icon-q-bellGearFill" viewBox="0 0 48 48" fill="none"><g clip-path="url(#icon-37f675dab4e52a6)"><path d="M21 5C21 3.34315 22.3431 2 24 2C25.6569 2 27 3.34315 27 5V7.29778C33.8883 8.68521 39.0806 14.7569 39.111 22.0468C38.7448 22.0158 38.3742 22 38 22C30.8203 22 25 27.8203 25 35C25 36.0325 25.1204 37.037 25.3479 38H7L8.88889 32.3529V22.1111C8.88889 14.7926 14.0915 8.68929 21 7.29778V5Z" fill="currentColor"></path><path d="M28.7538 44.1382C27.8429 43.2167 27.0688 42.1596 26.4644 41H17.2898C18.1503 43.8915 20.8289 46 23.9999 46C25.8351 46 27.5054 45.2938 28.7538 44.1382Z" fill="currentColor"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M35.6267 25L35.1258 27.5234C34.2905 27.8338 33.5182 28.2674 32.84 28.8145L30.3733 27.9785L28 32.0215L29.9738 33.707C29.9038 34.129 29.8585 34.5586 29.8585 35C29.8585 35.4414 29.9038 35.871 29.9738 36.293L28 37.9785L30.3733 42.0215L32.84 41.1856C33.5182 41.7326 34.2905 42.1662 35.1258 42.4766L35.6267 45H40.3733L40.8742 42.4766C41.7095 42.1662 42.4818 41.7326 43.16 41.1856L45.6267 42.0215L48 37.9785L46.0262 36.293C46.0962 35.871 46.1415 35.4414 46.1415 35C46.1415 34.5586 46.0962 34.129 46.0262 33.707L48 32.0215L45.6267 27.9785L43.16 28.8145C42.4818 28.2674 41.7095 27.8338 40.8742 27.5234L40.3733 25H35.6267ZM41.3334 34.9998C41.3334 36.8408 39.841 38.3332 38 38.3332C36.1591 38.3332 34.6667 36.8408 34.6667 34.9998C34.6667 33.1589 36.1591 31.6665 38 31.6665C39.841 31.6665 41.3334 33.1589 41.3334 34.9998Z" fill="currentColor"></path></g><defs><clipPath id="icon-37f675dab4e52a6"><rect width="48" height="48" fill="white"></rect></clipPath></defs></symbol>
  <symbol id="lego-ui-icon-q-topology2Fill" viewBox="0 0 48 48" fill="none"><path d="M6 4C4.89543 4 4 4.89543 4 6V12C4 13.1046 4.89543 14 6 14H11V39C11 40.1046 11.8954 41 13 41H26V42C26 43.1046 26.8954 44 28 44H42C43.1046 44 44 43.1046 44 42V36C44 34.8954 43.1046 34 42 34H28C26.8954 34 26 34.8954 26 36V37H15V26H26V27C26 28.1046 26.8954 29 28 29H42C43.1046 29 44 28.1046 44 27V21C44 19.8954 43.1046 19 42 19H28C26.8954 19 26 19.8954 26 21V22H15V14H20C21.1046 14 22 13.1046 22 12V6C22 4.89543 21.1046 4 20 4H6Z" fill="currentColor"></path></symbol>
  <symbol id="lego-ui-icon-q-clusterFill" viewBox="0 0 48 48" fill="none"><path d="M24 11.0002L35.2584 17.5002V30.5002L24.9904 36.4285V27.5002L12.7417 20.4285V17.5002L24 11.0002Z" fill="currentColor"></path><path d="M21.9904 29.2323V35.84L12.7417 30.5002V23.8926L21.9904 29.2323Z" fill="currentColor"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M23 3.57752C23.6188 3.22025 24.3812 3.22025 25 3.57752L41.1865 12.9228C41.8053 13.2801 42.1865 13.9403 42.1865 14.6549V33.3455C42.1865 34.06 41.8053 34.7203 41.1865 35.0775L25 44.4228C24.3812 44.7801 23.6188 44.7801 23 44.4228L6.81348 35.0775C6.19467 34.7203 5.81348 34.06 5.81348 33.3455V14.6549C5.81348 13.9403 6.19467 13.2801 6.81348 12.9228L23 3.57752ZM9.81348 15.8096L24 7.61897L38.1865 15.8096V32.1908L24 40.3814L9.81348 32.1908V15.8096Z" fill="currentColor"></path></symbol>
  <symbol id="lego-ui-icon-q-subtractBoxFill" viewBox="0 0 48 48" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M8 6C6.89543 6 6 6.89543 6 8V40C6 41.1046 6.89543 42 8 42H40C41.1046 42 42 41.1046 42 40V8C42 6.89543 41.1046 6 40 6H8ZM14 26H34V22H14V26Z" fill="currentColor"></path></symbol>
  <symbol id="lego-ui-icon-q-dotLine2Fill" viewBox="0 0 48 48" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M33 9C33 13.2832 30.008 16.8675 26 17.777V30.223C30.008 31.1325 33 34.7168 33 39C33 43.9706 28.9706 48 24 48C19.0294 48 15 43.9706 15 39C15 34.7168 17.992 31.1325 22 30.223V17.777C17.992 16.8675 15 13.2832 15 9C15 4.02944 19.0294 0 24 0C28.9706 0 33 4.02944 33 9ZM24 14C26.7614 14 29 11.7614 29 9C29 6.23858 26.7614 4 24 4C21.2386 4 19 6.23858 19 9C19 11.7614 21.2386 14 24 14Z" fill="currentColor"></path></symbol>
  
  <symbol id="lego-ui-icon-q-dockerHubDuotone"  viewBox="0 0 48 48" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M25 3.57728C24.3812 3.22001 23.6188 3.22001 23 3.57728L6.81348 12.9226C6.19467 13.2798 5.81348 13.9401 5.81348 14.6546V33.3452C5.81348 34.0598 6.19467 34.72 6.81348 35.0773L23 44.4226C23.6188 44.7798 24.3812 44.7798 25 44.4226L41.1865 35.0773C41.8053 34.72 42.1865 34.0598 42.1865 33.3452V14.6546C42.1865 13.9401 41.8053 13.2798 41.1865 12.9226L25 3.57728ZM36 14L24 7L12 14L24 21L36 14ZM22.1174 26.449L10.0555 19.4851L10.04 22.9403L22.1019 29.9042L22.1174 26.449ZM10.0243 26.4671L10.0088 29.9222L22.0706 36.8862L22.0861 33.431L10.0243 26.4671Z" fill="#B6C2CD"></path><path d="M36 14L24 7L12 14L24 21L36 14Z" fill="currentColor"></path><path d="M22.1174 26.449L10.0555 19.4851L10.04 22.9403L22.1019 29.9042L22.1174 26.449Z" fill="currentColor"></path><path d="M10.0088 29.9222L10.0243 26.4671L22.0861 33.431L22.0706 36.8862L10.0088 29.9222Z" fill="currentColor"></path></symbol>
  
  <symbol id="lego-ui-icon-q-bellGearDuotone" viewBox="0 0 48 48" fill="none">
    <g clip-path="url(#icon-8ca6c25b9c8b12d)"><path d="M24 7C15.6544 7 8.88889 13.7655 8.88889 22.1111V32.3529L7 38H25.3479C25.1204 37.037 25 36.0325 25 35C25 27.8203 30.8203 22 38 22C38.3742 22 38.7448 22.0158 39.111 22.0468C39.0763 13.7308 32.3242 7 24 7Z" fill="#B6C2CD"></path><path d="M21 5C21 3.34315 22.3431 2 24 2C25.6569 2 27 3.34315 27 5V7.29778C26.0304 7.10248 25.0272 7 24 7C22.9728 7 21.9696 7.10248 21 7.29778V5Z" fill="currentColor"></path><path d="M17.0709 38C17.0242 38.3266 17 38.6605 17 39C17 42.866 20.134 46 24 46C25.8352 46 27.5054 45.2938 28.7538 44.1383C27.1056 42.4707 25.9052 40.3596 25.3479 38H17.0709Z" fill="currentColor"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M35.1258 27.5234L35.6267 25H40.3733L40.8742 27.5234C41.7095 27.8338 42.4818 28.2674 43.16 28.8145L45.6267 27.9785L48 32.0215L46.0262 33.707C46.0962 34.129 46.1415 34.5586 46.1415 35C46.1415 35.4414 46.0962 35.871 46.0262 36.293L48 37.9785L45.6267 42.0215L43.16 41.1856C42.4818 41.7326 41.7095 42.1662 40.8742 42.4766L40.3733 45H35.6267L35.1258 42.4766C34.2905 42.1662 33.5182 41.7326 32.84 41.1856L30.3733 42.0215L28 37.9785L29.9738 36.293C29.9038 35.871 29.8585 35.4414 29.8585 35C29.8585 34.5586 29.9038 34.129 29.9738 33.707L28 32.0215L30.3733 27.9785L32.84 28.8145C33.5182 28.2674 34.2905 27.8338 35.1258 27.5234ZM38 38.3332C39.841 38.3332 41.3334 36.8408 41.3334 34.9998C41.3334 33.1589 39.841 31.6665 38 31.6665C36.1591 31.6665 34.6667 33.1589 34.6667 34.9998C34.6667 36.8408 36.1591 38.3332 38 38.3332Z" fill="currentColor"></path></g> </symbol> 
    <defs><clipPath id="icon-8ca6c25b9c8b12d"><rect width="48" height="48" fill="white"></rect></clipPath></defs>
    </symbol>
   <symbol id="lego-ui-icon-q-upload2Fill" viewBox="0 0 48 48" fill="none"><path d="M23.2748 3.76315C23.6691 3.34815 24.3306 3.34815 24.7248 3.76316L41.3955 21.3112C42.0006 21.9482 41.5491 23 40.6705 23H32V35.7333C32 36.9852 31.1046 38 30 38H18C16.8954 38 16 36.9852 16 35.7333V23H7.32914C6.45054 23 5.999 21.9482 6.60414 21.3112L23.2748 3.76315Z" fill="currentColor"></path><path d="M36 41H12V45H36V41Z" fill="currentColor"></path></symbol> 
    
   <symbol id="lego-ui-icon-q-pingFill" viewBox="0 0 48 48" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M7 4C5.89543 4 5 4.89543 5 6V34C5 35.1046 5.89543 36 7 36H19V42C19 43.1046 19.8954 44 21 44H43V40H23V36H27C28.1046 36 29 35.1046 29 34V18H43V14H29V6C29 4.89543 28.1046 4 27 4H7ZM11 22H17V25L23 20L17 15V18H11V22Z" fill="currentColor"></path><path d="M43 31H37V34L31 29L37 24V27H43V31Z" fill="currentColor"></path></symbol>
  <symbol id="lego-ui-icon-q-down2Fill" viewBox="0 0 48 48" fill="none"><path d="M25.9999 4H21.9999V28H12.2036C11.3444 28 10.8853 29.0119 11.451 29.6585L23.2473 43.1399C23.6457 43.5952 24.354 43.5952 24.7524 43.1399L36.5486 29.6585C37.1144 29.0119 36.6552 28 35.7961 28H25.9999V4Z" fill="currentColor"></path></symbol>
   <symbol  id="lego-ui-icon-q-kmsFill" viewBox="0 0 48 48" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M5 15C5 20.2249 8.33923 24.6698 13 26.3172L13 30H10C9.44771 30 9 30.4477 9 31V37C9 37.5523 9.44771 38 10 38H13V41.1716C13 41.702 13.2107 42.2107 13.5858 42.5858L16.2929 45.2929C16.6834 45.6834 17.3166 45.6834 17.7071 45.2929L20.4142 42.5858C20.7893 42.2107 21 41.702 21 41.1716L21 26.3172C25.6608 24.6698 29 20.2249 29 15C29 8.37258 23.6274 3 17 3C10.3726 3 5 8.37258 5 15ZM17 19C14.7909 19 13 17.2091 13 15C13 12.7909 14.7909 11 17 11C19.2091 11 21 12.7909 21 15C21 17.2091 19.2091 19 17 19Z" fill="currentColor"></path><path d="M32 15C32 17.1333 31.5547 19.1626 30.7519 21H41C42.1046 21 43 20.1046 43 19V11C43 9.89543 42.1046 9 41 9H30.7519C31.5547 10.8374 32 12.8667 32 15Z" fill="currentColor"></path><path d="M29.0011 24C27.6743 25.7664 25.9666 27.2303 24 28.2699V36H41C42.1046 36 43 35.1046 43 34V26C43 24.8954 42.1046 24 41 24H29.0011Z" fill="currentColor"></path></symbol>
   <symbol id="lego-ui-icon-q-book3Fill" viewBox="0 0 48 48" fill="none"><path d="M4 11.3106C4 10.5806 4.3972 9.91079 5.0708 9.62954C6.69126 8.95297 10.0055 7.84814 14.0041 8.05017C17.9076 8.2474 20.8506 9.44067 22.5 10.3011V40.3321C20.6026 39.5426 17.1928 38.3052 13.9704 38.0647C10.2987 37.7907 7.06047 38.3681 5.33043 38.7766C4.66802 38.933 4 38.4353 4 37.7547V11.3106Z" fill="currentColor"></path><path d="M25.5 40.3321C27.3974 39.5426 30.8072 38.3052 34.0296 38.0647C37.7013 37.7907 40.9395 38.3681 42.6696 38.7766C43.332 38.933 44 38.4353 44 37.7547V11.3106C44 10.5806 43.6028 9.91079 42.9292 9.62954C41.3087 8.95297 37.9945 7.84814 33.9959 8.05017C30.0924 8.2474 27.1494 9.44067 25.5 10.3011V40.3321Z" fill="currentColor"></path></symbol>
   <symbol id="lego-ui-icon-q-dockerHubFill" viewBox="0 0 48 48" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M23 3.57728C23.6188 3.22001 24.3812 3.22001 25 3.57728L41.1865 12.9226C41.8053 13.2798 42.1865 13.9401 42.1865 14.6546V33.3452C42.1865 34.0598 41.8053 34.72 41.1865 35.0773L25 44.4226C24.3812 44.7798 23.6188 44.7798 23 44.4226L6.81348 35.0773C6.19467 34.72 5.81348 34.0598 5.81348 33.3452V14.6546C5.81348 13.9401 6.19467 13.2798 6.81348 12.9226L23 3.57728ZM24 7L36 14L24 21L12 14L24 7ZM22.1174 26.449L10.0555 19.4851L10.04 22.9403L22.1019 29.9042L22.1174 26.449ZM10.0088 29.9222L10.0243 26.4671L22.0861 33.431L22.0706 36.8862L10.0088 29.9222Z" fill="currentColor"></path></symbol>
   <symbol id="lego-ui-icon-q-functionPlayFill" viewBox="0 0 48 48" fill="none"><path d="M6 8C6 6.89543 6.89543 6 8 6H40C41.1046 6 42 6.89543 42 8V19.627C40.7399 19.2199 39.3956 19 38 19V14H10V38H26.4644C27.267 39.5399 28.3688 40.8989 29.6929 42H8C6.89543 42 6 41.1046 6 40V8Z" fill="currentColor"></path><path d="M25.627 28C25.2199 29.2601 25 30.6044 25 32H22V28H25.627Z" fill="currentColor"></path><path d="M27.7523 24C29.117 22.2544 30.918 20.8664 32.9912 20H22V24H27.7523Z" fill="currentColor"></path><path d="M14 20H18V24H14V20Z" fill="currentColor"></path><path d="M14 28H18V32H14V28Z" fill="currentColor"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M48 32C48 37.5228 43.5229 42 38 42C32.4772 42 28 37.5228 28 32C28 26.4772 32.4772 22 38 22C43.5229 22 48 26.4772 48 32ZM43 32L35 37V27L43 32Z" fill="currentColor"></path></symbol>
   <symbol id="lego-ui-icon-q-functionPencilFill" viewBox="0 0 48 48" fill="none"><path d="M6 8C6 6.89543 6.89543 6 8 6H40C41.1046 6 42 6.89543 42 8V21.142L38 25.1421V14H10V38H25.1421L25 38.1421V42H8C6.89543 42 6 41.1046 6 40V8Z" fill="currentColor"></path><path d="M34 29.1421L31.1421 32H22V28H34V29.1421Z" fill="currentColor"></path><path d="M18 20H14V24H18V20Z" fill="currentColor"></path><path d="M34 20H22V24H34V20Z" fill="currentColor"></path><path d="M14 28H18V32H14V28Z" fill="currentColor"></path><path d="M43.3846 24L48 28.6153L44.9231 31.6921L40.3077 27.0768L43.3846 24Z" fill="currentColor"></path><path d="M38.7692 28.6158L43.3846 33.2311L32.6154 44H28V39.3847L38.7692 28.6158Z" fill="currentColor"></path></symbol>
   <symbol id="lego-ui-icon-q-operationManageFill"  viewBox="0 0 48 48" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M19.8372 3C19.36 3 18.9493 3.33721 18.8564 3.8053L18.0731 7.75115C18.0055 8.09175 17.7652 8.37094 17.4436 8.50188C16.0617 9.06452 14.7686 9.79155 13.5978 10.6724C13.3242 10.8783 12.9676 10.9438 12.6433 10.8339L8.75517 9.51622C8.30609 9.36403 7.81186 9.54815 7.57182 9.95707L3.42427 17.0225C3.17888 17.4406 3.26864 17.9744 3.63727 18.2892L6.71547 20.9179C6.98204 21.1456 7.10794 21.4959 7.05997 21.8432C6.96241 22.5495 6.90292 23.267 6.90292 24C6.90292 24.733 6.96241 25.4505 7.05997 26.1568C7.10794 26.5041 6.98204 26.8544 6.71547 27.0821L3.63727 29.7108C3.26864 30.0256 3.17888 30.5594 3.42427 30.9775L7.57182 38.0429C7.81186 38.4518 8.30609 38.636 8.75517 38.4838L12.6433 37.1661C12.9676 37.0562 13.3242 37.1217 13.5978 37.3276C14.7686 38.2085 16.0617 38.9355 17.4436 39.4981C17.7652 39.6291 18.0055 39.9082 18.0731 40.2488L18.8564 44.1947C18.9493 44.6628 19.36 45 19.8372 45H28.163C28.6402 45 29.0509 44.6628 29.1439 44.1947L29.9271 40.2488C29.9947 39.9082 30.235 39.6291 30.5566 39.4981C31.9385 38.9355 33.2316 38.2085 34.4024 37.3276C34.676 37.1217 35.0326 37.0562 35.3569 37.1661L39.2451 38.4838C39.6941 38.636 40.1884 38.4518 40.4284 38.0429L44.576 30.9775C44.8214 30.5594 44.7316 30.0256 44.363 29.7108L41.2848 27.0821C41.0182 26.8544 40.8923 26.5041 40.9403 26.1568C41.0378 25.4505 41.0973 24.733 41.0973 24C41.0973 23.267 41.0378 22.5495 40.9403 21.8432C40.8923 21.4959 41.0182 21.1456 41.2848 20.9179L44.363 18.2892C44.7316 17.9744 44.8214 17.4406 44.576 17.0225L40.4284 9.95707C40.1884 9.54815 39.6941 9.36403 39.2451 9.51622L35.3569 10.8339C35.0326 10.9438 34.676 10.8783 34.4024 10.6724C33.2316 9.79155 31.9385 9.06452 30.5566 8.50188C30.235 8.37094 29.9947 8.09175 29.9271 7.75115L29.1439 3.8053C29.0509 3.33721 28.6402 3 28.163 3H19.8372ZM18.3414 26C18.944 27.7048 20.2952 29.056 22 29.6586V33.8C18.0817 33.0046 14.9954 29.9183 14.2 26H18.3414ZM22 18.3414C20.2952 18.944 18.944 20.2952 18.3414 22H14.2C14.9954 18.0817 18.0817 14.9954 22 14.2V18.3414ZM29.6586 22C29.056 20.2952 27.7048 18.944 26 18.3414V14.2C29.9183 14.9954 33.0046 18.0817 33.8 22H29.6586ZM26 29.6586C27.7048 29.056 29.056 27.7048 29.6586 26H33.8C33.0046 29.9183 29.9183 33.0046 26 33.8V29.6586Z" fill="currentColor"></path></symbol>
    <symbol id="lego-ui-icon-q-apps3Fill" viewBox="0 0 48 48" fill="none"><path d="M22.5855 3.41416C23.3665 2.63311 24.6329 2.63311 25.4139 3.41416L33.9391 11.9394L23.9998 21.8787L14.0604 11.9393L22.5855 3.41416Z" fill="currentColor"></path><path d="M11.939 14.0606L3.41391 22.5857C2.63286 23.3668 2.63286 24.6331 3.41391 25.4142L11.9391 33.9394L21.8785 24L11.939 14.0606Z" fill="currentColor"></path><path d="M23.9998 26.1214L14.0605 36.0607L22.5855 44.5857C23.3665 45.3668 24.6329 45.3668 25.4139 44.5857L33.939 36.0606L23.9998 26.1214Z" fill="currentColor"></path><path d="M36.0604 33.9393L44.5855 25.4142C45.3665 24.6331 45.3665 23.3668 44.5855 22.5857L36.0605 14.0607L26.1211 24L36.0604 33.9393Z" fill="currentColor"></path></symbol>
    <symbol id="lego-ui-icon-q-eventDuotone" viewBox="0 0 48 48" fill="none"><path d="M11.9789 9.1507L6.84008 4.01184L4.01166 6.84027L9.15051 11.9791L11.9789 9.1507Z" fill="#B6C2CD"></path><path d="M9.15054 36.0208L4.00391 41.1674L6.83233 43.9958L11.979 38.8492L9.15054 36.0208Z" fill="#B6C2CD"></path><path d="M36.0206 38.8492L41.167 43.9956L43.9954 41.1672L38.849 36.0208L36.0206 38.8492Z" fill="#B6C2CD"></path><path d="M38.849 11.9792L43.9955 6.8327L41.1671 4.00427L36.0206 9.15073L38.849 11.9792Z" fill="#B6C2CD"></path><path d="M27.0003 8.94006C27.0003 7.98521 25.7898 7.57352 25.2076 8.33036L13.2385 23.8902C12.7327 24.5478 13.2015 25.4999 14.0311 25.4999H21.0003V39.0598C21.0003 40.0147 22.2107 40.4264 22.7929 39.6695L34.762 24.1097C35.2679 23.452 34.7991 22.4999 33.9694 22.4999H27.0003V8.94006Z" fill="currentColor"></path></symbol>
    <symbol id="lego-ui-icon-q-apiFill" viewBox="0 0 48 48" fill="none"><path d="M8 6C6.89543 6 6 6.89543 6 8V16.5H14V14H34V16.5H42V8C42 6.89543 41.1046 6 40 6H8Z" fill="currentColor"></path><path d="M42 19.5H34V28.5H42V19.5Z" fill="currentColor"></path><path d="M42 31.5H34V34H14V31.5H6V40C6 41.1046 6.89543 42 8 42H40C41.1046 42 42 41.1046 42 40V31.5Z" fill="currentColor"></path><path d="M14 19.5V28.5H6V19.5H14Z" fill="currentColor"></path></symbol>
    <symbol id="lego-ui-icon-q-javaFill"  viewBox="0 0 48 48" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M8 6C6.89543 6 6 6.89543 6 8V40C6 41.1046 6.89543 42 8 42H40C41.1046 42 42 41.1046 42 40V8C42 6.89543 41.1046 6 40 6H8ZM24.0474 16.1911C22.2487 17.6059 20.588 18.9122 22.9364 23.6859C16.7053 18.8577 19.6844 16.591 22.7376 14.2678C24.7068 12.7695 26.7069 11.2477 26.2865 9C27.5355 13.4473 25.731 14.8667 24.0474 16.1911ZM24.448 22.4269C23.219 20.1084 21.549 16.9583 28.9116 14.8289C24.4563 16.4972 25.2552 18.6786 25.98 20.6575C26.5307 22.1613 27.0387 23.5483 25.1654 24.5043C25.2678 23.9732 24.8859 23.2528 24.448 22.4269ZM30.2837 25.1301C27.7111 27.3695 12.4916 27.6813 19.0724 24.1675C6.30073 27.4405 28.1388 31.5322 30.2837 25.1301ZM19.7942 29.7747C16.2938 32.7356 26.9652 34.0328 28.4801 29.7747C25.4089 31.0259 20.437 31.8208 19.7942 29.7747ZM15.0604 32.174C-0.231237 36.989 32.3307 39.7156 36 32.9443C31.8618 35.1834 9.51794 36.989 15.0604 32.174ZM31.0637 29.4141C37.6444 27.0074 33.3061 21.2791 30.2837 24.5043C33.3061 24.1675 33.9883 26.6702 31.0637 29.4141Z" fill="currentColor"></path></symbol>
    <symbol id="lego-ui-icon-q-pythonFill" viewBox="0 0 48 48" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M14.0658 8.27918C14.0658 8.27918 13.4483 4 23.3379 4C33.6733 4 32.8746 9.15937 32.8746 9.15937V17.6846C32.8746 22.8406 27.6157 22.7558 27.6157 22.7558H18.2554C12.6423 22.7558 12.82 28.2671 12.82 28.2671V32.8873H9.52356C9.52356 32.8873 4 33.2405 4 23.2838C4 13.3274 10.3284 14.0436 10.3284 14.0436H23.5143V12.7125H14.0768L14.0658 8.27918ZM21.1275 6.87251C20.7106 6.45565 20.1451 6.22169 19.5556 6.22222C18.966 6.22169 18.4005 6.45565 17.9836 6.87251C17.5668 7.28937 17.3328 7.85491 17.3333 8.44444C17.3328 9.03398 17.5668 9.59952 17.9836 10.0164C18.4005 10.4332 18.966 10.6672 19.5556 10.6667C20.1451 10.6672 20.7106 10.4332 21.1275 10.0164C21.5444 9.59952 21.7783 9.03398 21.7778 8.44444C21.7783 7.85491 21.5444 7.28937 21.1275 6.87251Z" fill="currentColor"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M33.9343 39.7208C33.9343 39.7208 34.5518 44 24.6622 44C14.327 44 15.1254 38.8408 15.1254 38.8408V30.3154C15.1254 25.1592 20.3843 25.244 20.3843 25.244H29.7446C35.3577 25.244 35.18 19.7327 35.18 19.7327V15.1126H38.4764C38.4764 15.1126 44 14.7595 44 24.716C44 34.6727 37.6716 33.9566 37.6716 33.9566H24.4857V35.2876H33.9233L33.9343 39.7208ZM26.8725 41.1275C27.2894 41.5444 27.8549 41.7783 28.4444 41.7778C29.034 41.7783 29.5995 41.5442 30.0164 41.1273C30.4332 40.7105 30.6672 40.145 30.6667 39.5555C30.6672 38.966 30.4332 38.4004 30.0164 37.9836C29.5995 37.5667 29.034 37.3328 28.4444 37.3333C27.8549 37.3328 27.2893 37.5668 26.8724 37.9837C26.4556 38.4006 26.2216 38.9661 26.2222 39.5557C26.2217 40.1452 26.4556 40.7107 26.8725 41.1275Z" fill="currentColor"></path></symbol>
    <symbol  id="lego-ui-icon-q-appFill" width="32" height="32" viewBox="0 0 48 48" fill="none"><path d="M8 6C6.89543 6 6 6.89543 6 8V22.5H22.5V6H8Z" fill="currentColor"></path><path d="M42 25.5H25.5V42H40C41.1046 42 42 41.1046 42 40V25.5Z" fill="currentColor"></path><path d="M22.5 25.5V42H8C6.89543 42 6 41.1046 6 40V25.5H22.5Z" fill="currentColor"></path><path d="M34 6C29.5817 6 26 9.58172 26 14C26 18.4183 29.5817 22 34 22C38.4183 22 42 18.4183 42 14C42 9.58172 38.4183 6 34 6Z" fill="currentColor"></path></symbol>
    <symbol id="lego-ui-icon-q-apps3Duotone" viewBox="0 0 48 48" fill="none"><path d="M36.0604 14.0607L26.121 24L36.0604 33.9393L44.5855 25.4142C45.3665 24.6332 45.3665 23.3668 44.5855 22.5858L36.0604 14.0607Z" fill="#B6C2CD"></path><path d="M33.939 36.0607L23.9997 26.1213L14.0604 36.0607L22.5855 44.5858C23.3665 45.3669 24.6329 45.3668 25.4139 44.5858L33.939 36.0607Z" fill="#B6C2CD"></path><path d="M11.939 33.9393L21.8784 24L11.939 14.0607L3.41391 22.5858C2.63286 23.3668 2.63286 24.6332 3.41391 25.4142L11.939 33.9393Z" fill="#B6C2CD"></path><path d="M25.4142 3.4144L33.9681 11.9683L24.0604 21.9393L14.0645 11.9357L22.5857 3.4144C23.3668 2.63335 24.6331 2.63335 25.4142 3.4144Z" fill="currentColor"></path></symbol>
    <symbol id="lego-ui-icon-q-inferenceEnginDuotone" viewBox="0 0 48 48" fill="none"><path d="M11 22V18H33.3414C34.1651 15.6696 36.3876 14 39 14C42.3137 14 45 16.6863 45 20C45 23.3137 42.3137 26 39 26C36.3876 26 34.1651 24.3304 33.3414 22H11Z" fill="currentColor"></path><path d="M11 36.0286V32.019C13.056 32.135 15.0518 32.7785 16.7927 33.8927L18.1139 34.7382C19.4013 35.5621 20.8977 36 22.4262 36H27.3414C28.1651 33.6696 30.3876 32 33 32C36.3137 32 39 34.6863 39 38C39 41.3137 36.3137 44 33 44C30.3876 44 28.1651 42.3304 27.3414 40H22.4262C20.1335 40 17.8888 39.3432 15.9577 38.1073L14.6365 37.2618C13.5396 36.5598 12.2909 36.138 11 36.0286Z" fill="currentColor"></path><path d="M5 3C3.89543 3 3 3.89543 3 5V43C3 44.1046 3.89543 45 5 45H9C10.1046 45 11 44.1046 11 43V28.5H21.2908C21.8841 29.9659 23.3213 31 25 31C27.2091 31 29 29.2091 29 27C29 24.7909 27.2091 23 25 23C23.3213 23 21.8841 24.0341 21.2908 25.5H11V14.5H11.4666C13.8306 14.5 16.1373 13.7714 18.0725 12.4134L20.0263 11.0423C21.4566 10.0385 23.1616 9.5 24.9089 9.5H32.2908C32.8841 10.9659 34.3213 12 36 12C38.2091 12 40 10.2091 40 8C40 5.79086 38.2091 4 36 4C34.3213 4 32.8841 5.03408 32.2908 6.5H24.9089C22.5448 6.5 20.2382 7.2286 18.303 8.5866L16.3492 9.95773C14.9188 10.9615 13.2139 11.5 11.4666 11.5H11V5C11 3.89543 10.1046 3 9 3H5Z" fill="#B6C2CD"></path></symbol>
    <svg  id="lego-ui-icon-q-dataWarehouseDuotone" viewBox="0 0 48 48" fill="none"><path d="M6 8.72237C6 7.73238 6.72428 6.89136 7.70332 6.7445L26 4V44L7.70332 41.2555C6.72428 41.1086 6 40.2676 6 39.2776V8.72237Z" fill="#B6C2CD"></path><path d="M39.434 17.6745C36.8816 18.5253 33.5464 19 30 19C29.6646 19 29.3311 18.9958 29 18.9873V23.9863C29.3297 23.9954 29.6632 24 30 24C36.6274 24 42 22.2091 42 20V16.5364C41.2115 17.0042 40.3288 17.3762 39.434 17.6745Z" fill="currentColor"></path><path d="M42 12C42 14.2091 36.6274 16 30 16C29.6632 16 29.3297 15.9954 29 15.9863V8.01369C29.2061 8.00802 29.4136 8.00409 29.6225 8.00194C29.7479 8.00065 29.8737 8 30 8C36.6274 8 42 9.79086 42 12Z" fill="currentColor"></path><path d="M29 39.9863C29.3297 39.9954 29.6632 40 30 40C36.6274 40 42 38.2091 42 36V32.5364C41.2115 33.0042 40.3288 33.3762 39.434 33.6745C36.8816 34.5253 33.5464 35 30 35C29.6646 35 29.3311 34.9958 29 34.9873V39.9863Z" fill="currentColor"></path><path d="M42 28V24.5364C41.2115 25.0042 40.3288 25.3762 39.434 25.6745C36.8816 26.5253 33.5464 27 30 27C29.6646 27 29.3311 26.9958 29 26.9873V31.9863C29.3297 31.9954 29.6632 32 30 32C36.6274 32 42 30.2091 42 28Z" fill="currentColor"></path></svg>
    <svg id="lego-ui-icon-q-apiDuotone" viewBox="0 0 48 48" fill="none"><path d="M14 18H6V30H14V18Z" fill="currentColor"></path><path d="M42 18H34V30H42V18Z" fill="currentColor"></path><path d="M6 8C6 6.89543 6.89543 6 8 6H40C41.1046 6 42 6.89543 42 8V18H34V14H14V18H6V8Z" fill="#B6C2CD"></path><path d="M6 30V40C6 41.1046 6.89543 42 8 42H40C41.1046 42 42 41.1046 42 40V30H34V34H14V30H6Z" fill="#B6C2CD"></path></svg>
    </svg>
`

export default icons
const icons = `
<svg   
  aria-hidden="true"
  style="position: absolute; width: 0; height: 0; overflow: hidden;"
  xmlns="http://www.w3.org/2000/svg"
  xmlns:xlink="http://www.w3.org/1999/xlink"
xmlns="http://www.w3.org/2000/svg">
    <symbol id="lego-ui-icon-q-bell2Duotone" viewBox="0 0 48 48" fill="none"><path d="M10 21C10 13.268 16.268 7 24 7C31.732 7 38 13.268 38 21V32L40 38H8L10 32V21Z" fill="#B6C2CD"></path><path d="M24 2C22.3431 2 21 3.34315 21 5V7.32218C21.9665 7.11118 22.9703 7 24 7C25.0297 7 26.0335 7.11118 27 7.32218V5C27 3.34315 25.6569 2 24 2Z" fill="currentColor"></path><path d="M17.0709 38C17.0242 38.3266 17 38.6605 17 39C17 42.866 20.134 46 24 46C27.866 46 31 42.866 31 39C31 38.6605 30.9758 38.3266 30.9291 38H17.0709Z" fill="currentColor"></path><path d="M34.8008 5.5996C38.9233 8.69644 41.6729 13.5223 41.9728 19.0004H45.9778C45.6742 12.2132 42.2952 6.22626 37.2009 2.39941L34.8008 5.5996Z" fill="currentColor"></path><path d="M2.02246 19.0004C2.32609 12.2132 5.70504 6.22626 10.7994 2.39941L13.1995 5.5996C9.07697 8.69644 6.32742 13.5223 6.02745 19.0004H2.02246Z" fill="currentColor"></path></symbol>
    <symbol id="lego-ui-icon-q-iot2Duotone" viewBox="0 0 48 48" fill="none"><path d="M24 4C17.9408 4 12.7807 7.84922 10.8315 13.2358C6.35124 14.2263 3 18.2218 3 23C3 27.2327 5.62977 30.8513 9.34459 32.3108L10 31V23H38V31L38.6554 32.3108C42.3702 30.8513 45 27.2327 45 23C45 18.2218 41.6488 14.2263 37.1685 13.2358C35.2193 7.84922 30.0592 4 24 4Z" fill="#B6C2CD"></path><path d="M17.5 32.2576V26H14.5V32.2576C14.5 32.3423 14.4785 32.4256 14.4374 32.4997L12.4838 36.029C12.3252 36.0098 12.1637 36 12 36C9.79086 36 8 37.7909 8 40C8 42.2091 9.79086 44 12 44C14.2091 44 16 42.2091 16 40C16 39.0458 15.6659 38.1697 15.1083 37.4822L17.0621 33.9527C17.3493 33.4338 17.5 32.8506 17.5 32.2576Z" fill="currentColor"></path><path d="M30.5 32.2576V26H33.5V32.2576C33.5 32.3423 33.5215 32.4256 33.5626 32.4997L35.5162 36.029C35.6748 36.0098 35.8363 36 36 36C38.2091 36 40 37.7909 40 40C40 42.2091 38.2091 44 36 44C33.7909 44 32 42.2091 32 40C32 39.0458 32.3341 38.1697 32.8917 37.4822L30.9379 33.9527C30.6507 33.4338 30.5 32.8506 30.5 32.2576Z" fill="currentColor"></path><path d="M24 44C26.2091 44 28 42.2091 28 40C28 38.3213 26.9659 36.8841 25.5 36.2908V26H22.5V36.2908C21.0341 36.8841 20 38.3213 20 40C20 42.2091 21.7909 44 24 44Z" fill="currentColor"></path></symbol>
    <symbol id="lego-ui-icon-q-event2Duotone"  viewBox="0 0 48 48" fill="none"><path d="M11.9789 9.1507L6.84008 4.01184L4.01166 6.84027L9.15051 11.9791L11.9789 9.1507Z" fill="#B6C2CD"></path><path d="M9.15054 36.0208L4.00391 41.1674L6.83233 43.9958L11.979 38.8492L9.15054 36.0208Z" fill="#B6C2CD"></path><path d="M36.0206 38.8492L41.167 43.9956L43.9954 41.1672L38.849 36.0208L36.0206 38.8492Z" fill="#B6C2CD"></path><path d="M38.849 11.9792L43.9955 6.8327L41.1671 4.00427L36.0206 9.15073L38.849 11.9792Z" fill="#B6C2CD"></path><path d="M27.0003 8.94006C27.0003 7.98521 25.7898 7.57352 25.2076 8.33036L13.2385 23.8902C12.7327 24.5478 13.2015 25.4999 14.0311 25.4999H21.0003V39.0598C21.0003 40.0147 22.2107 40.4264 22.7929 39.6695L34.762 24.1097C35.2679 23.452 34.7991 22.4999 33.9694 22.4999H27.0003V8.94006Z" fill="currentColor"></path></symbol>
    <symbol id="lego-ui-icon-q-idCardDuotone" viewBox="0 0 48 48" fill="none"><path d="M18 23C20.2091 23 22 21.2091 22 19C22 16.7909 20.2091 15 18 15C15.7909 15 14 16.7909 14 19C14 21.2091 15.7909 23 18 23Z" fill="currentColor"></path><path d="M38 16H30V19H38V16Z" fill="currentColor"></path><path d="M38 23H30V26H38V23Z" fill="currentColor"></path><path d="M10 30C10 27.7909 11.7909 26 14 26H22C24.2091 26 26 27.7909 26 30V33H10V30Z" fill="currentColor"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M6 8C4.89543 8 4 8.89543 4 10V38C4 39.1046 4.89543 40 6 40H42C43.1046 40 44 39.1046 44 38V10C44 8.89543 43.1046 8 42 8H6ZM22 19C22 21.2091 20.2091 23 18 23C15.7909 23 14 21.2091 14 19C14 16.7909 15.7909 15 18 15C20.2091 15 22 16.7909 22 19ZM30 16H38V19H30V16ZM38 23H30V26H38V23ZM14 26C11.7909 26 10 27.7909 10 30V33H26V30C26 27.7909 24.2091 26 22 26H14Z" fill="#B6C2CD"></path></symbol>
    <symbol id="lego-ui-icon-q-shutdownFill" viewBox="0 0 48 48" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M24 44C35.0457 44 44 35.0457 44 24C44 12.9543 35.0457 4 24 4C12.9543 4 4 12.9543 4 24C4 35.0457 12.9543 44 24 44ZM26 24V10H22V24H26ZM12 24C12 19.157 14.8689 14.9841 19 13.0881V17.7546C17.1711 19.2208 16 21.4736 16 24C16 28.4183 19.5817 32 24 32C28.4183 32 32 28.4183 32 24C32 21.4736 30.8289 19.2208 29 17.7546V13.0881C33.1311 14.9841 36 19.157 36 24C36 30.6274 30.6274 36 24 36C17.3726 36 12 30.6274 12 24Z" fill="currentColor"></path></symbol>
      <symbol id="lego-ui-icon-q-listViewFill" viewBox="0 0 48 48" fill="none"><path d="M8 6C6.89543 6 6 6.89543 6 8V14C6 15.1046 6.89543 16 8 16H18C19.1046 16 20 15.1046 20 14V8C20 6.89543 19.1046 6 18 6H8Z" fill="currentColor"></path><path d="M42 9H24V13H42V9Z" fill="currentColor"></path><path d="M6 21C6 19.8954 6.89543 19 8 19H18C19.1046 19 20 19.8954 20 21V27C20 28.1046 19.1046 29 18 29H8C6.89543 29 6 28.1046 6 27V21Z" fill="currentColor"></path><path d="M42 22H24V26H42V22Z" fill="currentColor"></path><path d="M6 34C6 32.8954 6.89543 32 8 32H18C19.1046 32 20 32.8954 20 34V40C20 41.1046 19.1046 42 18 42H8C6.89543 42 6 41.1046 6 40V34Z" fill="currentColor"></path><path d="M42 35H24V39H42V35Z" fill="currentColor"></path></symbol>

</svg>
`

export default icons
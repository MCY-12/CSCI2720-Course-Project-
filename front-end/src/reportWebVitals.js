/*CSCI2720 Project Group 15
MUI Chung Yin (1155163035)
WONG Chun Fei (1155144394)
NIU Ka Ngai (1155174712)
LI Chi (1155172017)
AU YEUNG Ho Hin (1155189480)*/

const reportWebVitals = onPerfEntry => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    });
  }
};

export default reportWebVitals;

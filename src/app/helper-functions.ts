export function hexToRgbaString(hex, opacity) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function (m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? ('rgba(' + parseInt(result[1], 16) + ',' + parseInt(result[2], 16) + ',' + parseInt(result[3], 16) + ', ' + opacity + ')') : ('rgba(0,0,0,' + opacity + ')');
}


// import moment from 'moment';

// export function calculateAndAddEventDates(courseAssignmentList, translate) {
//     courseAssignmentList.forEach(courseAssignment => {
//         courseAssignment.firstEvent = moment(courseAssignment.startDate).format('DD.MM.YYYY');

//         var nTimeToComplete = Number(courseAssignment.timeToComplete) - 1;
//         if (!courseAssignment.endDate || (courseAssignment.endDate && moment().isSameOrBefore(moment(courseAssignment.endDate).add(nTimeToComplete, 'days'), 'day'))) {
//             // Comes here if:
//             // => no end date specified
//             // => end date set and end date plus 'days to complete' is today or in the future
//             var firstEndDate = moment(courseAssignment.startDate).add(nTimeToComplete, 'days');
//             if (moment().isSameOrBefore(firstEndDate, 'day')) {
//                 // This is the first iteration of the series
//                 courseAssignment.nextEvent = courseAssignment.firstEvent + ' - ' + firstEndDate.format('DD.MM.YYYY');
//                 courseAssignment.nextEventStart = moment(courseAssignment.startDate);
//                 courseAssignment.nextEventEnd = firstEndDate;
//             } else if (Number(courseAssignment.isSeries) == 1) {
//                 // Find next course date
//                 var nRepeatSpan = Number(courseAssignment.repeatSpan);
//                 const strAddUnit = courseAssignment.repeatUnit == "year" ? 'years' : 'months';
//                 var nextStartDate = moment(courseAssignment.startDate).add(nRepeatSpan, strAddUnit);
//                 var bNextDateFound = false;
//                 while (!bNextDateFound) {
//                     var nextEndDate = moment(nextStartDate).add(nTimeToComplete, 'days');
//                     if (moment().isSameOrBefore(nextEndDate, 'day')) {
//                         courseAssignment.nextEvent = nextStartDate.format('DD.MM.YYYY') + ' - ' + nextEndDate.format('DD.MM.YYYY');
//                         courseAssignment.nextEventStart = nextStartDate;
//                         courseAssignment.nextEventEnd = nextEndDate;
//                         bNextDateFound = true;
//                     } else {
//                         nextStartDate = nextStartDate.add(nRepeatSpan, strAddUnit);
//                     }
//                 }
//             } else {
//                 courseAssignment.nextEvent = translate.instant('assignment.NoFurtherDates');
//             }

//             if (courseAssignment.nextEventStart && courseAssignment.nextEventEnd) {
//                 if (moment().isSame(courseAssignment.nextEventStart, 'day') ||
//                     moment().isBetween(courseAssignment.nextEventStart, courseAssignment.nextEventEnd, 'day')) {
//                     courseAssignment.active = true;
//                 }
//             }
//         } else {
//             courseAssignment.nextEvent = translate.instant('assignment.NoFurtherDates');
//         }

//         if (Number(courseAssignment.isSeries) == 1) {
//             var unit = courseAssignment.repeatUnit == "year" ? translate.instant('assignment.Years') : translate.instant('assignment.Months');
//             courseAssignment.recurrence = courseAssignment.repeatSpan + ' ' + unit;
//         } else {
//             courseAssignment.recurrence = '-';
//         }

//         if (courseAssignment.endDate) {
//             courseAssignment.endDate = moment(courseAssignment.endDate).format('DD.MM.YYYY');
//         } else {
//             courseAssignment.endDate = '-';
//         }
//     });
// }

// export function extractEffectiveCourseAssignments(courseAssignmentList) {
//     // Get unique course Ids
//     var courseIdArray = Array.from(new Set(courseAssignmentList.map(courseAss => courseAss.courseId)));

//     var courseInfoMap = new Map();
//     courseIdArray.forEach(courseId => {
//         var courseInfo = { fixedDates: [], series: [] };
//         //courseInfoList.push(courseInfo);
//         courseInfoMap.set(courseId, courseInfo);
//     });

//     // Devide into fixed dates and series
//     courseAssignmentList.forEach(courseAssignment => {
//         if (courseInfoMap.has(courseAssignment.courseId)) {
//             if (Number(courseAssignment.isSeries) == 1) {
//                 courseInfoMap.get(courseAssignment.courseId).series.push(courseAssignment);
//             } else {
//                 courseInfoMap.get(courseAssignment.courseId).fixedDates.push(courseAssignment);
//             }
//         }
//     });

//     courseInfoMap.forEach((value, key) => {
//         value.series = _getEffectiveCourseSeriesRule(value.series);
//     });

//     return courseInfoMap;
// }

// function _getEffectiveCourseSeriesRule(seriesList) {
//     // Sort in active/past/future
//     var activeSeries = [];
//     var pastSeries = [];
//     //var futureSeries = [];
//     seriesList.forEach(series => {
//         var activeState = _getSeriesActiveState(series);
//         console.warn(activeState);
//         switch (activeState) {
//             case -1: {
//                 pastSeries.push(series);
//                 break;
//             }
//             case 0: {
//                 activeSeries.push(series);
//                 break;
//             }
//             // case 1: {
//             //     futureSeries.push(series);
//             //     break;
//             // }
//         }
//     });

//     if (activeSeries.length > 0) {
//         return _getShortestOrForcedSeries(activeSeries);
//     }

//     if (pastSeries.length > 0) {
//         return _getClosestPassedSeries(pastSeries);
//     }

//     return [];
// }

// function _getSeriesActiveState(series) {
//     // return values:
//     // -1 => past
//     // 0 => active
//     // 1 future

//     // Check if start date is in the future
//     if (moment(series.startDate).isAfter(moment(), 'day')) {
//         // Start is in the future
//         return 1;
//     }

//     // Check if end date set
//     if (!series.endDate) {
//         // This is an active rule
//         return 0;
//     }

//     // Check if course has already ended
//     var nRepeatSpan = Number(series.repeatSpan);
//     const strAddUnit = series.repeatUnit == "year" ? 'years' : 'months';

//     var nTimeToComplete = Number(series.timeToComplete);
//     var nextEventStart = moment(series.startDate);
//     while (nextEventStart.isSameOrBefore(moment(series.endDate), 'day')) {
//         var nextEventEnd = nextEventStart.add(nTimeToComplete - 1, 'days');
//         if (nextEventEnd.isSameOrAfter(moment(), 'day')) {
//             // This is an active rule
//             return 0;
//         }
//         nextEventStart = nextEventStart.add(nRepeatSpan, strAddUnit);
//     }

//     // Otherwise this event lies in the past
//     return -1;
// }

// function _getClosestPassedSeries(seriesList) {
//     console.log("here");
//     var closestPassedSeries = undefined;
//     seriesList.forEach(series => {
//         if (closestPassedSeries == undefined) {
//             closestPassedSeries = series;
//         } else {
//             var closestDays = moment().diff(moment(closestPassedSeries.endDate), 'days');
//             var currentDays = moment().diff(moment(series.endDate), 'days');
//             if (currentDays < closestDays) {
//                 closestPassedSeries = series;
//             }
//         }
//     });
//     return closestPassedSeries;
// }

// function _getShortestOrForcedSeries(seriesList) {
//     var forcedSeries = [];
//     var notForcedSeries = [];
//     seriesList.forEach(series => {
//         if (Number(series.forceSeries) == 1) {
//             forcedSeries.push(series);
//         } else {
//             notForcedSeries.push(series);
//         }
//     });

//     if (forcedSeries.length > 0) {
//         return _getShortestSeries(forcedSeries);
//     } else {
//         return _getShortestSeries(seriesList);
//     }
// }

// function _getShortestSeries(seriesList) {
//     var shortestSeries = undefined;
//     seriesList.forEach(series => {
//         if (shortestSeries == undefined) {
//             shortestSeries = series;
//         } else {
//             var shortestRepeatSpanMonths = _getRepeatSpanMonths(shortestSeries);
//             var currentRepeatSpanMonths = _getRepeatSpanMonths(series);
//             if (currentRepeatSpanMonths < shortestRepeatSpanMonths) {
//                 shortestSeries = series;
//             }
//         }
//     });
//     return shortestSeries;
// }

// function _getRepeatSpanMonths(series) {
//     var nMultFactor = series.repeatUnit == "year" ? 12 : 1;
//     return Number(series.repeatSpan) * nMultFactor;
// }
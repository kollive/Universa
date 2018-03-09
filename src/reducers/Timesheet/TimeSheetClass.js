import * as _ from "lodash";
export default class TimeSheetClass {
    constructor(){
         this.timesheetArray=[];
    }
    setTime(key,time,date) {
        debugger
    
        let timesheet
        timesheet=_.find(this.timesheetArray, ['timesheet_date', date]);
        if(timesheet!=undefined)
        {   
         switch (key) {
            case 'Clock In':
                timesheet.start_time = time
                break;
            case 'Lunch In':
                timesheet.lunch_start = time
                break;
            case 'Lunch Out':
                timesheet.lunch_end =time
                break;
            case 'Clock Out':
                timesheet.end_time =time
                break;
        }
        }
        else{
       let localtime=[];
        localtime.timesheet_date=date;
        switch (key) {
            case 'Clock In':
                localtime.start_time = time
                break;
            case 'Lunch In':
                localtime.lunch_start = time
                break;
            case 'Lunch Out':
                localtime.lunch_end =time
                break;
            case 'Clock Out':
                localtime.end_time =time
                break;
        }
        this.timesheetArray.push(localtime)
        
        }
    }
 
    getTime() {
       return this.timesheetArray;
    }
}

class ScheduleController {
  constructor(Schedule, $state, $scope) {
    this.name = 'schedule';
    this.$scope = $scope;
    this.$state = $state;

    this.Schedule = Schedule;
    this.schedulelist = {};
    this.newSchedule = {};
    this.scheduleToEdit = {};
    this.events = [];
    this.Schedule.getAll().then((response) => {
      this.schedulelist = response.data;
      console.log("LIST", this.schedulelist);
      for (var i = 0; i <= this.schedulelist.length; i++) {
        var d = new Date(this.schedulelist[i].date);
        this.events.push({
          title: "From: " + this.schedulelist[i].from + " To: " + this.schedulelist[i].to,
          start: d,
          end: d + 1,
          allDay: false
        })
      }

    }, (reject) => {
      console.log('Something went wrong');
    });

    var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();

    $scope.changeTo = 'Hungarian';
    /* event source that pulls from google.com */
    $scope.eventSource = {};
    /* event source that contains custom events on the scope */

    /* event source that calls a function on every view switch */
    $scope.eventsF = function (start, end, timezone, callback) {
      var s = new Date(start).getTime() / 1000;
      var e = new Date(end).getTime() / 1000;
      var m = new Date(start).getMonth();
      var events = [{
        title: 'Feed Me ' + m,
        start: s + (50000),
        end: s + (100000),
        allDay: false,
        className: ['customFeed']
      }];
      callback(events);
    };

    $scope.calEventsExt = {
      color: '#f00',
      textColor: 'yellow',
      events: [
        {type: 'party', title: 'Lunch', start: new Date(y, m, d, 12, 0), end: new Date(y, m, d, 14, 0), allDay: false},
        {
          type: 'party',
          title: 'Lunch 2',
          start: new Date(y, m, d, 12, 0),
          end: new Date(y, m, d, 14, 0),
          allDay: false
        },
        {
          type: 'party',
          title: 'Click for Google',
          start: new Date(y, m, 28),
          end: new Date(y, m, 29),
          url: 'http://google.com/'
        }
      ]
    };
    /* alert on eventClick */
    $scope.alertOnEventClick = function (date, jsEvent, view) {
      $scope.alertMessage = (date.title + ' was clicked ');
    };
    /* alert on Drop */
    $scope.alertOnDrop = function (event, delta, revertFunc, jsEvent, ui, view) {
      $scope.alertMessage = ('Event Dropped to make dayDelta ' + delta);
    };
    /* alert on Resize */
    $scope.alertOnResize = function (event, delta, revertFunc, jsEvent, ui, view) {
      $scope.alertMessage = ('Event Resized to make dayDelta ' + delta);
    };
    /* add and removes an event source of choice */
    $scope.addRemoveEventSource = function (sources, source) {
      var canAdd = 0;
      angular.forEach(sources, function (value, key) {
        if (sources[key] === source) {
          sources.splice(key, 1);
          canAdd = 1;
        }
      });
      if (canAdd === 0) {
        sources.push(source);
      }
    };
    /* add custom event*/
    $scope.addEvent = function () {
      $scope.events.push({
        title: 'Open Sesame',
        start: new Date(y, m, 28),
        end: new Date(y, m, 29),
        className: ['openSesame']
      });
    };
    /* remove event */
    $scope.remove = function (index) {
      $scope.events.splice(index, 1);
    };
    /* Change View */
    $scope.changeView = function (view, calendar) {
      uiCalendarConfig.calendars[calendar].fullCalendar('changeView', view);
    };
    /* Change View */
    $scope.renderCalendar = function (calendar) {
      $timeout(function () {
        if (uiCalendarConfig.calendars[calendar]) {
          uiCalendarConfig.calendars[calendar].fullCalendar('render');
        }
      });
    };
    /* Render Tooltip */
    $scope.eventRender = function (event, element, view) {
      element.attr({
        'tooltip': event.title,
        'tooltip-append-to-body': true
      });
      $compile(element)($scope);
    };
    /* config object */
    $scope.uiConfig = {
      calendar: {
        height: 450,
        editable: true,
        header: {
          left: 'title',
          center: '',
          right: 'today prev,next'
        },
        eventClick: $scope.alertOnEventClick,
        eventDrop: $scope.alertOnDrop,
        eventResize: $scope.alertOnResize,
        eventRender: $scope.eventRender
      }
    };

    $scope.changeLang = function () {
      if ($scope.changeTo === 'Hungarian') {
        $scope.uiConfig.calendar.dayNames = ["Vasárnap", "Hétfő", "Kedd", "Szerda", "Csütörtök", "Péntek", "Szombat"];
        $scope.uiConfig.calendar.dayNamesShort = ["Vas", "Hét", "Kedd", "Sze", "Csüt", "Pén", "Szo"];
        $scope.changeTo = 'English';
      } else {
        $scope.uiConfig.calendar.dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        $scope.uiConfig.calendar.dayNamesShort = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        $scope.changeTo = 'Hungarian';
      }
    };
    /* event sources array*/
    $scope.eventSources = [this.events, $scope.eventSource, $scope.eventsF];
    $scope.eventSources2 = [$scope.calEventsExt, $scope.eventsF, $scope.events];
    this.$scope.uiConfig = {
      calendar: {
        height: 450,
        editable: true,
        header: {
          left: 'month basicWeek agendaDay',
          center: 'title',
          right: 'today prev,next'
        },
        eventClick: this.alertEventOnClick,
        eventDrop: this.alertOnDrop,
        eventResize: this.alertOnResize
      }
    };
    /* alert on eventClick */

  }

  alertOnEventClick = function (date, jsEvent, view) {
    this.alertMessage = (date.title + ' was clicked ');
  };

 formSubmit(schedule) {
    this.newSchedule = {
      to: schedule.to,
      from: schedule.from,
      date:schedule.date,
    };
    console.log("current new schedule state: ", this.newSchedule);
    this.Schedule.addSchedule(this.newSchedule).then((response)=>{
      console.log(' Schedule Added :',response.data);
      this.$state.go('schedule', {});
    },(reject)=>{
    });
  }
  remove(id){
    console.log(id);
    this.Schedule.removeSchedule(id).then((response)=>{
      console.log('Schedule deleted !', response.data);
      this.Schedule.getAll().then((response)=>{
        this.schedulelist = response.data;
        console.log("LIST",this.schedulelist);
      },(reject)=>{
        console.log('Something went wrong');
      })
    },(reject)=>{

    })
  }
  /*To get the schedule clicked*/
  edit(id){
    console.log("OBJ ID edit clicked ",id);
    this.Schedule.setScheduleToEdit(this.Schedule.getOneSchedule(id));
  }

  getAck() {
    console.log(this.Schedule.getAll());
  }
returned (){
  this.Schedule.getAll().then((response)=>{
    this.schedulelist = response.data;
    console.log("LIST",this.schedulelist);
  },(reject)=>{
    console.log('Something went wrong');
  })
}
}
export default ScheduleController;

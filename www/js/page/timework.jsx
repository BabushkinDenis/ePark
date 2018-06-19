import React from "react";
import style from './timework.scss';
import busEvent from '../busEvent';


class TimeWorkRow extends React.Component {
    constructor(props) {
        super(props);
        this.rowEnable = this.rowEnable.bind(this);
        this.rowDisable = this.rowDisable.bind(this);
        this.onInputChange = this.onInputChange.bind(this);
        this.state = {
            enable: this.props.row.enable
        }
    }

    rowEnable() {
        this.setState({ enable: true });
    }

    rowDisable() {
        this.setState({ enable: false });
    }

    onInputChange(e) {
        this.props.onChangeTime(this.props.typeSchedule, this.props.id, e.target.name, e.target.value);
    }

    render() {
        const row = this.props.row;
        return (
            <div className="TimeWork__row _clearfix">
                <div className="TimeWork__row_checkCell" onClick={this.state.enable? this.rowDisable : this.rowEnable}>
                    <span className={this.state.enable ? "checkbox _checked" : "checkbox"}></span>
                    <span className="label">{row.label}</span>
                </div>
                <div className="TimeWork__row_inputCell">
                    <span className= {!this.state.enable ? "_hidden" : ""}>
                        <input className="_from" name="from" value={row.from} onChange={this.onInputChange}/>
                        <span className="seporate"></span>
                        <input className="_to" name="to" value={row.to} onChange={this.onInputChange}/>
                    </span>
                    <span className={this.state.enable ? "_hidden" : "closedPlaceholder"}> closed </span>
                </div>
            </div>
        );
    }
}

class Schedule extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            default: [{ label: "Mo-Fr", enable: true, from: "08:00", to: "24:00" }, { label: "Saturday", from: "08:00", to: "24:00" }, { label: "Sunday", from: "08:00", to: "24:00"}],
            personal: [
                { label: "Monday", enable: true , from: "08:00", to: "24:00"}, 
                { label: "Tuesday", enable: true, from: "08:00", to: "24:00"}, 
                { label: "Wednesday", enable: true, from: "08:00", to: "24:00"}, 
                { label: "Thursday", enable: true, from: "08:00", to: "24:00"}, 
                { label: "Friday", enable: true, from: "08:00", to: "24:00"}, 
                { label: "Saturday", enable: true, from: "08:00", to: "24:00"}, 
                { label: "Sunday", enable: true, from: "08:00", to: "24:00" }
            ],
            typeSchedule: "24/7"
        };
        this.initExternalListners.apply(this);
        this.onTypeScheduleSelected = this.onTypeScheduleSelected.bind(this);
        this.onChangeTime = this.onChangeTime.bind(this);
    }

    initExternalListners() {

    };

    onTypeScheduleSelected(typeSchedule) {
        this.setState({ typeSchedule: typeSchedule });
        busEvent.trigger("changedSchedule", this.state);
    }

    onChangeTime(typeSchedule, id, field, value) {
        this.state[typeSchedule][id][field] = value;
        this.setState(this.state);
        busEvent.trigger("changedSchedule", this.state);
    }

    render() {
        let state = this.state;
        const onTypeScheduleSelected = this.onTypeScheduleSelected;
        const onChangeTime = this.onChangeTime;
        return (
            <div>
               
                <div className="TimeWork__row">
                    <span onClick={this.onTypeScheduleSelected.bind(null, "DEFAULT")}>
                        <span className={state.typeSchedule == "DEFAULT" ? "radiobox _checked" : "radiobox"} ></span>
                        <span className = "label">Default</span>
                    </span>
                    <div className={state.typeSchedule == "DEFAULT" ? "_clearfix" : "_hidden"} >
                        {state.default.map(function (row, key) {
                            return <TimeWorkRow row={row} key={key} id = {key} typeSchedule="default" onChangeTime = {onChangeTime}/>
                        })}
                    </div>
                </div>
               
        
                <div className="TimeWork__row" onClick={this.onTypeScheduleSelected.bind(null, "24/7")}>
                    <span className={state.typeSchedule == "24/7" ? "radiobox _checked" : "radiobox"} ></span>
                    <span className="label">24/7</span>
                </div>
            

                <div className="TimeWork__row">
                    <span onClick={this.onTypeScheduleSelected.bind(null, "PERSONAL")}>
                        <span className={state.typeSchedule == "PERSONAL" ? "radiobox _checked" : "radiobox"} ></span>
                        <span className="label">Personal</span>
                    </span>
                    <div className={state.typeSchedule == "PERSONAL" ? "_clearfix" : "_hidden"} >
                        {state.personal.map(function (row, key) {
                            return <TimeWorkRow row={row} key={key} id={key}  typeSchedule="personal" onChangeTime={onChangeTime}/>
                        })}
                    </div>
                </div>
             
            </div>
        );
    }
}


export default Schedule;
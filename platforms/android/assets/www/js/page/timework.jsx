import React from "react";
import style from './timework.scss';
import busEvent from '../busEvent';


class TimeWorkRow extends React.Component {
    constructor(props) {
        super(props);
        this.rowEnable = this.rowEnable.bind(this);
        this.rowDisable = this.rowDisable.bind(this);
        this.onInputChange = this.onInputChange.bind(this);
        // this.state = {
        //     enable: this.props.row.enable
        // }
    }

    rowEnable() {
        //this.setState({ enable: true });
        this.props.onScheduleRowEnable(this.props.typeSchedule, this.props.id);
    }

    rowDisable() {
        //this.setState({ enable: false });
        this.props.onScheduleRowDisable(this.props.typeSchedule, this.props.id);
    }

    onInputChange(e) {
        this.props.onChangeTime(this.props.typeSchedule, this.props.id, e.target.name, e.target.value);
    }

    render() {
        const row = this.props.row;
        let arrayTo = [];
        let arrayFrom = [];

        for (let i = 1440; i > 0; i -= 15) {
            arrayTo.push(("0" + Math.floor(i / 60)).slice(-2) + ":" + ("0" + (i % 60)).slice(-2));
        }
        for (let i = 0; i < 1440; i += 15) {
            arrayFrom.push(("0" + Math.floor(i / 60)).slice(-2) + ":" + ("0" + (i % 60)).slice(-2));
        }


        return (
            <div className="TimeWork__row _clearfix">
                <div className="TimeWork__row_checkCell" onClick={row.enable ? this.rowDisable : this.rowEnable}>
                    <span className={row.enable ? "checkbox _checked" : "checkbox"}></span>
                    <span className="label">{row.label}</span>
                </div>
                <div className="TimeWork__row_inputCell">
                    <span className= {!row.enable ? "_hidden" : ""}>
                        <select className="_from" name="from" onChange={this.onInputChange}>
                            {arrayFrom.map(function (item) {
                                return <option value={item} selected={row.from == item ? "selected" : ""}>{item}</option>
                            })}
                        </select>
                        <span className="seporate"></span>
                        <select className="_to" name="to" value={row.to} onChange={this.onInputChange}>
                            {arrayTo.map(function (item) {
                                return <option value={item} selected={row.to == item? "selected":""}>{item}</option>
                            })}
                        </select>
                        
                    </span>
                    <span className={row.enable ? "_hidden" : "closedPlaceholder"}> closed </span>
                </div>
            </div>
        );
    }
}

class Schedule extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            default: [{ label: "Mo-Fr", enable: true, from: "08:00", to: "21:00", name: "mon,tue,wd,th,ft" }, { label: "Saturday", from: "08:00", to: "14:00", name: "st" }, { label: "Sunday", from: "08:00", to: "14:00", name: "sn" }, { label: "holliday", enable: false, from: "08:00", to: "14:00", name: "holliday" }],
            personal: [
                { label: "Monday", enable: true , from: "08:00", to: "24:00", name: "mon"}, 
                { label: "Tuesday", enable: true, from: "08:00", to: "24:00", name: "tue"}, 
                { label: "Wednesday", enable: true, from: "08:00", to: "24:00", name: "wd"}, 
                { label: "Thursday", enable: true, from: "08:00", to: "24:00", name: "th"}, 
                { label: "Friday", enable: true, from: "08:00", to: "24:00", name: "fr"}, 
                { label: "Saturday", enable: true, from: "08:00", to: "24:00", name: "st"}, 
                { label: "Sunday", enable: true, from: "08:00", to: "24:00", name: "sn" },
                { label: "holliday", enable: false, from: "08:00", to: "14:00", name: "holliday"}
            ],
            typeSchedule: "24/7"
        };
        this.initExternalListners.apply(this);
        this.onTypeScheduleSelected = this.onTypeScheduleSelected.bind(this);
        this.onScheduleRowEnable = this.onScheduleRowEnable.bind(this);
        this.onScheduleRowDisable = this.onScheduleRowDisable.bind(this);
        this.onChangeTime = this.onChangeTime.bind(this);
        busEvent.trigger("changedSchedule", this.state);
    }

    initExternalListners() {
        busEvent.on("timework:reset", ()=>{
            this.setState({
                default: [{ label: "Mo-Fr", enable: true, from: "08:00", to: "21:00", name: "mon,tue,wd,th,ft" }, { label: "Saturday", from: "08:00", to: "14:00", name: "st" }, { label: "Sunday", from: "08:00", to: "14:00", name: "sn" }, { label: "holliday", enable: false, from: "08:00", to: "14:00", name: "holliday" }],
                personal: [
                    { label: "Monday", enable: true, from: "08:00", to: "24:00", name: "mon" },
                    { label: "Tuesday", enable: true, from: "08:00", to: "24:00", name: "tue" },
                    { label: "Wednesday", enable: true, from: "08:00", to: "24:00", name: "wd" },
                    { label: "Thursday", enable: true, from: "08:00", to: "24:00", name: "th" },
                    { label: "Friday", enable: true, from: "08:00", to: "24:00", name: "fr" },
                    { label: "Saturday", enable: true, from: "08:00", to: "24:00", name: "st" },
                    { label: "Sunday", enable: true, from: "08:00", to: "24:00", name: "sn" },
                    { label: "holliday", enable: false, from: "08:00", to: "14:00", name: "holliday" }
                ],
                typeSchedule: "24/7"
            });
        })
    };

    onScheduleRowEnable(typeSchedule, id){
        this.state[typeSchedule][id].enable = true;
        this.setState(this.state);
        busEvent.trigger("changedSchedule", this.state);
    }
    onScheduleRowDisable(typeSchedule, id) {
        this.state[typeSchedule][id].enable = false;
        this.setState(this.state);
        busEvent.trigger("changedSchedule", this.state);
    }

    onTypeScheduleSelected(typeSchedule) {
        this.state.typeSchedule = typeSchedule; 
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
        const onScheduleRowEnable = this.onScheduleRowEnable;
        const onScheduleRowDisable = this.onScheduleRowDisable;
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
                            return <TimeWorkRow row={row} key={key} id={key} typeSchedule="default" onChangeTime={onChangeTime} onScheduleRowEnable={onScheduleRowEnable} onScheduleRowDisable={onScheduleRowDisable}/>
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
                            return <TimeWorkRow row={row} key={key} id={key} typeSchedule="personal" onChangeTime={onChangeTime} onScheduleRowEnable={onScheduleRowEnable} onScheduleRowDisable={onScheduleRowDisable}/>
                        })}
                    </div>
                </div>

             
            </div>
        );
    }
}


export default Schedule;
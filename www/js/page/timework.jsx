import React from "react";
import style from './timework.scss';



class TimeWorkRow extends React.Component {
    constructor(props) {
        super(props);
        this.rowEnable = this.rowEnable.bind(this);
        this.rowDisable = this.rowDisable.bind(this);
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
                        <input className="_from" value="08:00" />
                        <span className="seporate"></span>
                        <input className="_to" value="24:00" />
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
            default: [{ label: "Mo-Fr" , enable: true}, { label: "Saturday" }, { label: "Sunday" }],
            personal: [
                { label: "Monday", enable: true }, 
                { label: "Tuesday", enable: true }, 
                { label: "Wednesday", enable: true }, 
                { label: "Thursday", enable: true }, 
                { label: "Friday", enable: true }, 
                { label: "Saturday", enable: true }, 
                { label: "Sunday", enable: true }
            ],
            typePrice: "24/7"
        };
        this.initExternalListners.apply(this);
        this.onTypePriceSelected = this.onTypePriceSelected.bind(this);
    }

    initExternalListners() {

    };

    onTypePriceSelected(typePrice) {
        this.setState({ typePrice: typePrice });
    }

    render() {
        const state = this.state;
        const onTypePriceSelected = this.onTypePriceSelected;
        return (
            <div>
               
                <div className="TimeWork__row">
                    <span onClick={this.onTypePriceSelected.bind(null, "DEFAULT")}>
                        <span className={state.typePrice == "DEFAULT" ? "radiobox _checked" : "radiobox"} ></span>
                        <span className = "label">Default</span>
                    </span>
                    <div className={state.typePrice == "DEFAULT" ? "_clearfix" : "_hidden"} >
                        {state.default.map(function (row, key) {
                            return <TimeWorkRow  row={row} key={key}/>
                        })}
                    </div>
                </div>
               
        
                <div className="TimeWork__row" onClick={this.onTypePriceSelected.bind(null, "24/7")}>
                    <span className={state.typePrice == "24/7" ? "radiobox _checked" : "radiobox"} ></span>
                    <span className="label">24/7</span>
                </div>
            

                <div className="TimeWork__row">
                    <span onClick={this.onTypePriceSelected.bind(null, "PERSONAL")}>
                        <span className={state.typePrice == "PERSONAL" ? "radiobox _checked" : "radiobox"} ></span>
                        <span className="label">Personal</span>
                    </span>
                    <div className={state.typePrice == "PERSONAL" ? "_clearfix" : "_hidden"} >
                        {state.personal.map(function (row, key) {
                            return <TimeWorkRow row={row} key={key} />
                        })}
                    </div>
                </div>
             
            </div>
        );
    }
}


export default Schedule;
import React from "react";
import style from './price.scss';
import busEvent from '../busEvent';


class PriceRow extends React.Component {
    constructor(props) {
        super(props);
        this.rowEnable = this.rowEnable.bind(this);
        this.rowDisable = this.rowDisable.bind(this);
        this.onChangeValue = this.onChangeValue.bind(this);
    }

    rowEnable() {
        this.props.onEnable(this.props.id);
    }

    rowDisable() {
        this.props.onDisable(this.props.id);
    }
    onChangeValue(e) {
        this.props.onPriceChange(this.props.id, e.target.name, e.target.value);
    }

    render() {
        let row = this.props.row;
        return (
            <tr className={row.enable ? "" : "_disable"}>
                <td>
                    <span className={row.enable ? "checkbox _checked" : "checkbox "} onClick={row.enable ? this.rowDisable : this.rowEnable}></span>
                    <span className={row.type == "sedan" ? "icon-car" : row.type == "suv" ? "icon-jeep" : row.type == "moto" ? "icon-moto":""}></span>
                </td>
                <td>
                    <span className="icon-dolla"></span>
                </td>
                <td>
                    <input type="" name="price_1" value={row.price_1} onChange={this.onChangeValue} className="costHour" type="number"  />
                </td>
                <td>
                    <input type="" name="price_2" value={row.price_2} onChange={this.onChangeValue} className="costHour" type="number" />
                </td>
                <td>
                    <input type="" name="price_3" value={row.price_3} onChange={this.onChangeValue} className="costHour" type="number" />
                </td>
            </tr>
        );
    }
}

class Price extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            rows: [{
                type: "sedan",
                name: "car",
                price_1: "",
                price_2: "",
                price_3: "",
                enable: true
            }, {
                type: "suv",
                name: "jeep",
                price_1: "",
                price_2: "",
                price_3: "",
                enable: false
            }, {
                type: "moto",
                name: "moto",
                price_1: "",
                price_2: "",
                price_3: "",
                enable: false
            }]
        };

        this.initExternalListners.apply(this);
        this.onPriceEnable = this.onPriceEnable.bind(this);
        this.onPriceDisable = this.onPriceDisable.bind(this);
        this.onPriceChange = this.onPriceChange.bind(this);
        busEvent.trigger("changedPrice", this.state);
    }

    initExternalListners() {
        busEvent.on("price:reset", () => {
            this.setState({
                rows: [{
                    type: "sedan",
                    name: "car",
                    price_1: "",
                    price_2: "",
                    price_3: "",
                    enable: true
                }, {
                    type: "suv",
                    name: "jeep",
                    price_1: "",
                    price_2: "",
                    price_3: "",
                    enable: false
                }, {
                    type: "moto",
                    name: "moto",
                    price_1: "",
                    price_2: "",
                    price_3: "",
                    enable: false
                }]
            });
        });
    };

    onPriceEnable(id) {
        let rows = this.state.rows.map(function (el, i) {
            if (i == id) { el.enable = true } return el
        });
        this.setState({ rows: rows});
        busEvent.trigger("changedPrice", this.state);
    }

    onPriceDisable(id) {
        let rows = this.state.rows.map(function (el, i) {
            if (i == id) { el.enable = false } return el
        });
        this.setState({ rows: rows });
        busEvent.trigger("changedPrice", this.state);
    }

    onPriceChange(id, typePrice, value) {
        let rows = this.state.rows.map(function (el, i) {
            if (i == id) { el[typePrice] = value } return el;
        });
        this.setState({ rows: rows });
        busEvent.trigger("changedPrice", this.state);
    }

    render() {
        let state = this.state;
        const onPriceEnable = this.onPriceEnable;
        const onPriceDisable = this.onPriceDisable;
        const onPriceChange = this.onPriceChange;
    
        return (
            <div>
               <table>
                    <thead>
                        <tr>
                            <th></th>
                            <th></th>
                            <th>Hora</th>
                            <th>12 Hs</th>
                            <th>24 Hs</th>
                        </tr>
                    </thead>
                    <tbody>
                        {state.rows.map(function (row, key) {
                            return <PriceRow row={row} key={key} id={key} onEnable={onPriceEnable} onDisable={onPriceDisable} onPriceChange={onPriceChange}/>
                        })}
                     </tbody>

               </table>
            </div>
        );
    }
}


export default Price;
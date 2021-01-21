import currency from "../handlers/currency";
import React from "react";

export default ({accounts}) => {
    return accounts.map(item => {
        return (<option key={item._id} value={item._id}>{item.title} ({currency(item.sum)})</option>)
    });
}
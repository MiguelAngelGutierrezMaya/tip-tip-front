import React from "react";

export function FCEHeader({ title, subtitle }) {

    return (
        <div className="card-header border-0 pt-5">
            <h3 className="card-title align-items-start flex-column">
                <span className="card-label font-weight-bolder text-dark">{title}</span>
                <span className="text-muted mt-3 font-weight-bold font-size-sm">{subtitle}</span>
            </h3>
        </div>
    );
}

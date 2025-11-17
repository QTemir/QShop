import React from "react";
import "./Topbar.css";
import SearchIcon from "./icons/SearchIcon";

export default function Topbar({ title = "Верхняя одежда" }) {
    return (
        <header className="tb-root">
            <h2 className="tb-title">{title}</h2>

            <div className="tb-search-wrapper">
                <div className="tb-search">
                    <div className="tb-icon">
                        <SearchIcon size={20}/>
                    </div>
                    <input
                        className="tb-input"
                        placeholder="Пальто"
                    />
                </div>
            </div>
        </header>
    );
}


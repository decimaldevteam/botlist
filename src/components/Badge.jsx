import React from 'react';

export default function Badge({ title, value, color }){
    return <span className="badge">
        <span className="badge-content">{title}</span>
        <span className="badge-cover" style={{ backgroundColor: color }}>{value}</span>
    </span>
}
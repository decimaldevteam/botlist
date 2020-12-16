import React from 'react';

export default function Entry({ name, info, id, placeholder }){
    return <tr className="entry" style={{ width: '100%' }}>
        <td className="new-bot-entry-label">
            <h3 style={{ fontWeight: 'bolder' }}>{name}:</h3>
            <p>{info || null}</p>
        </td>
        <td className="new-bot-entry-cover">
            <input id={id} placeholder={placeholder}/>
        </td>
    </tr>
}
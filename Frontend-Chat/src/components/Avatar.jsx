import React from 'react'

const Avatar = ({name}) => {

    const getAvatarColor = (messageSender) => {
    let hash = 0;
    for (let i = 0; i < messageSender.length; i++) {
      hash = 31 * hash + messageSender.charCodeAt(i);
    }

    const colors = [
      "#2196F3", "#32c787", "#00BCD4", "#ff5652",
      "#ffc107", "#ff85af", "#FF9800", "#39bbb0"
    ];

    const index = Math.abs(hash % colors.length);
    return colors[index];
  };
  return (
    <div
      style={{
        backgroundColor: getAvatarColor(name),
        width: "35px",
        height: "35px",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        fontWeight: "bold"
      }}
    >
      {name[0].toUpperCase()}
    </div>
  )
}

export default Avatar
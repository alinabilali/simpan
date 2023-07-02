import React, { useState, useEffect } from 'react';

const Notifications = ({ name }) => {
  const [notificationTime, setNotificationTime] = useState(
    new Date('2023-05-03T00:34:00')
  );

  useEffect(() => {
    const intervalId = setInterval(() => {
      const currentTime = new Date();
      if (currentTime >= notificationTime) {
        showNotification();
        clearInterval(intervalId);
      }
    }, 1000);
    return () => clearInterval(intervalId);
  }, [notificationTime]);

  const showNotification = () => {
    if (Notification.permission === 'granted') {
      new Notification(`${name} is expiring next week`, {
        body: `Eat ${name} or find recipe to avoid waste!`,
        icon: 'path/to/notification/icon.png',
      });
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          new Notification(`${name} is expiring next week`, {
            body: `Eat ${name} or find recipe to avoid waste!`,
            icon: 'path/to/notification/icon.png',
          });
        }
      });
    }
  };

  return <div></div>;
};

export default Notifications;

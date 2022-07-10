import { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import ScrollToBottom from 'react-scroll-to-bottom';

const Chat = ({ socket, userName, room }) => {
  const [currentMessage, setCurrentMessage] = useState('');
  const [messageList, setMessageList] = useState([]);

  const sendMessage = useCallback(async () => {
    if (currentMessage !== '') {
      const messageData = {
        room,
        author: userName,
        message: currentMessage,
        time: new Date().getHours() + ':' + new Date().getMinutes(),
      };

      await socket.emit('send_message', messageData);
      setCurrentMessage('');
      setMessageList((list) => [...list, messageData]);
    }
  }, [currentMessage]);

  useEffect(() => {
    socket.on('receive_message', (data) => {
      setMessageList((list) => [...list, data]);
    });
  }, [socket]);

  return (
    <div>
      <div className="chat-header">
        <p>Live Chat</p>
      </div>
      <div className="chat-body">
        <ScrollToBottom className="message-container">
          {messageList.map((messageContent, index) => {
            return (
              <div className='message' key={index} id={userName === messageContent.author ? 'you' : 'other'}>
                <div>
                  <div className='message-content'>
                    <p>{messageContent.message}</p>
                  </div>
                  <div className='message-mete'>
                    <p id="time">{messageContent.time}</p>
                    <p id="author">{messageContent.author}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </ScrollToBottom>
      </div>
      <div className="chat-footer">
        <input
          type='text'
          placeholder='Hey...'
          value={currentMessage}
          onChange={(event) => setCurrentMessage(event.target.value)}
          onKeyPress={(event) => event.key === 'Enter' && sendMessage()}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chat;

Chat.propTypes = {
  socket: PropTypes.object,
  userName: PropTypes.string,
  room: PropTypes.string,
};
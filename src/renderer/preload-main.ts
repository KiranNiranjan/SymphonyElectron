// @ts-nocheck

import { ipcRenderer } from 'electron';
import { UIManager } from '../app/UIManager';

import { GRAPH_CONFIG, IPC_MESSAGES } from '../app/Constants';

const uiManager = new UIManager();

document.addEventListener('DOMContentLoaded', () => {
  // UI event handlers
  document.querySelector('#SignIn').addEventListener('click', () => {
    ipcRenderer.send(IPC_MESSAGES.LOGIN);
  });

  document.querySelector('#SignOut').addEventListener('click', () => {
    ipcRenderer.send(IPC_MESSAGES.LOGOUT);
  });

  document.querySelector('#seeProfile').addEventListener('click', () => {
    ipcRenderer.send(IPC_MESSAGES.GET_PROFILE);
  });

  document.querySelector('#readMail').addEventListener('click', () => {
    ipcRenderer.send(IPC_MESSAGES.GET_MAIL);
  });
});

// Main process message subscribers
ipcRenderer.on(IPC_MESSAGES.SHOW_WELCOME_MESSAGE, (event, account) => {
  uiManager.showWelcomeMessage(account);
});

ipcRenderer.on(IPC_MESSAGES.SET_PROFILE, (event, graphResponse) => {
  uiManager.updateUI(graphResponse, GRAPH_CONFIG.GRAPH_ME_ENDPT);
});

ipcRenderer.on(IPC_MESSAGES.SET_MAIL, (event, graphResponse) => {
  uiManager.updateUI(graphResponse, GRAPH_CONFIG.GRAPH_MAIL_ENDPT);
});

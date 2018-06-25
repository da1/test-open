'use babel';

import TestOpenView from './test-open-view';
import { CompositeDisposable } from 'atom';

export default {

  testOpenView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.testOpenView = new TestOpenView(state.testOpenViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.testOpenView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'test-open:open':       () => this.open(),
      'test-open:openModule': () => this.openModule()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.testOpenView.destroy();
  },

  serialize() {
    return {
      testOpenViewState: this.testOpenView.serialize()
    };
  },

  open() {
    uri = atom.workspace.getActivePaneItem().getURI();
    if (uri.match(/\.p(m|l)$/)) {
      rootDirectory = atom.project.rootDirectories[0];
      directoryPath = rootDirectory.getPath();
      relativePath = uri.substr(directoryPath.length + 1);
      testFilePath = directoryPath + "/t/" + relativePath.replace(/\.p(m|l)$/, ".t");

      atom.workspace.open(testFilePath);
    } else if (uri.match(/\.go$/)) {
      rootDirectory = atom.project.rootDirectories[0];
      directoryPath = rootDirectory.getPath();
      relativePath = uri.substr(directoryPath.length + 1);
      testFilePath = directoryPath + "/" + relativePath.replace(/\.go$/, "_test.go");

      atom.workspace.open(testFilePath);
    }
  },

  openModule() {
    uri = atom.workspace.getActivePaneItem().getURI();
    rootDirectory = atom.project.rootDirectories[0];
    directoryPath = rootDirectory.getPath();
    relativePath = uri.substr(directoryPath.length + 1);
    filePath = directoryPath + "/" + relativePath.replace(/^t\//, "").replace(/\.t$/, ".pm");

    atom.workspace.open(filePath)
  }

};

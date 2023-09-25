'use strict';

import * as vscode from 'vscode';
import fs = require('fs');

const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

export default class MSearchDiff{

	private package_name: string = '';
//	private config: vscode.WorkspaceConfiguration;	//to use in the future
	private editor: vscode.TextEditor | undefined;

	constructor(package_name: string) {
		this.package_name = package_name;
//		this.config = vscode.workspace.getConfiguration(this.package_name);
	}

	// search, save and diff
	public async searchdiff(folder: string): Promise<void>  {
		// check selected folder
		if (!folder) {
			this.showAlert('Selected folder not found');
			return
		}
		if (!fs.existsSync(vscode.Uri.file(folder).fsPath)) {
			this.showAlert('Selected folder not found');
			return
		}

		// check workspaceFolders
		if (!vscode.workspace.workspaceFolders) {
			this.showAlert('workspacePath error');
			return;
		}

		// input search word
		const query = await vscode.window.showInputBox({title: 'search word'});

		// check search word
		if((query !== undefined)&&(query !== '')){
			// search in Workspacefolder
			await this.search('', query);
			await sleep(1000);	// can't work without sleep
			await this.save('search1.code-search');
			await sleep(1000);	// can't work without sleep

			// Search in selected folder
			await this.search(folder, query);
			await sleep(1000);	// can't work without sleep
			await this.save('search2.code-search');
			await sleep(1000);	// can't work without sleep

			// Search in selected folder
			await this.diff('search1.code-search', 'search2.code-search');
		}
		else{
			this.showAlert('Please input a search word');
		}
	}

	// open a new search editor
	public async search(folder: string, text: string): Promise<void>  {
		// check workspaceFolders
		if (!vscode.workspace.workspaceFolders) {
			this.showAlert('getworkspacePath error');
			return;
		}
		
		await vscode.commands.executeCommand('search.action.openNewEditor',
		 	{
				query: text,
				filesToInclude: folder,
				contextLines: 0
			});
	}

	// save a code-search file
	public async save(filename: string) : Promise<void> {

		// check activeTextEditor
		this.editor = vscode.window.activeTextEditor;
		if (!this.editor) {
			this.showAlert('activeEditor error');
			return;
		}

		// check workspaceFolders
		if (!vscode.workspace.workspaceFolders) {
			this.showAlert('workspacePath error');
			return;
		}

		// code-search file saves in workspaceFolder/.vscode/
		let folder_path = vscode.Uri.joinPath(vscode.workspace.workspaceFolders[0].uri, '/.vscode/');
		let file_path = vscode.Uri.joinPath(folder_path, filename);

		// whether workspaceFolder/.vscode/ exists
		if (!fs.existsSync(folder_path.fsPath)) {
			fs.mkdirSync(folder_path.fsPath);
		}

		// whether code-search file exists
		if (fs.existsSync(file_path.fsPath)) {
			await vscode.workspace.fs.delete(file_path);
		}

		file_path = vscode.Uri.joinPath(file_path).with({scheme:'untitled'});

		await vscode.workspace.openTextDocument(file_path).then((doc: vscode.TextDocument) => {

			const edit = new vscode.WorkspaceEdit();
			if (this.editor) {
				edit.insert(file_path, new vscode.Position(0, 0), this.editor.document.getText());
			}

			return vscode.workspace.applyEdit(edit).then(success => {
				if (success && this.editor) {
					vscode.commands.executeCommand('workbench.action.revertAndCloseActiveEditor').then(() =>
						vscode.window.showTextDocument(doc).then(() => {
							vscode.commands.executeCommand('workbench.action.files.save');
						})
					);
				}
			});
		});
	}

	//compare code-search files
	public async diff(file1: string, file2: string): Promise<void>  {
		// check workspaceFolders
		if (vscode.workspace.workspaceFolders === undefined) {
			this.showAlert('workspaceFolder path error');
			return;
		}

		//code-search files saved in workspaceFolder/.vscode/
		let folder_path = vscode.Uri.joinPath(vscode.workspace.workspaceFolders[0].uri, '/.vscode/');
		let file_path1 = vscode.Uri.joinPath(folder_path, file1);
		let file_path2 = vscode.Uri.joinPath(folder_path, file2);

		await vscode.commands.executeCommand('vscode.diff', file_path1, file_path2);
	}

	private showAlert(msg: string): void {
		vscode.window.showErrorMessage('m-search-diff:' + msg);
	}

	public dispose(): void {

	}

}
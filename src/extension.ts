// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "reader" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('reader.openReader', (e) => {
		const url:string = vscode.workspace.getConfiguration().get('reader.url') || '';
		const panel = vscode.window.createWebviewPanel(
			'reader', // Identifies the type of the webview. Used internally
			'阅读', // Title of the panel displayed to the user
			{
				viewColumn: vscode.ViewColumn.Beside,
				preserveFocus: true
			}, // Editor column to show the new webview panel in.
			{
				enableScripts: true,
				retainContextWhenHidden: true
			} // Webview options. More on these later.
		);
		panel.webview.html = getWebviewContent(url, panel);
	});

	function getWebviewContent(url: string, panel:vscode.WebviewPanel) {
		const resourcePath = path.join(context.extensionPath, 'src/ui/index.html');
		let html = fs.readFileSync(resourcePath, 'utf-8');
		html = html.replace(/(<link.+?href="|<script.+?src="|<img.+?src=")(.+?)"/g, (m, $1, $2) => {
			return (
				$1 +
				panel.webview.asWebviewUri(vscode.Uri.joinPath(context.extensionUri, 'src', 'ui' , $2)) +
				'"'
			);
		});
		html = html.replace('__BASE_URL__', url);
		return html;
	}


	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}

const vscode = require('vscode');
const axios = require('axios');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	// Get all my repository
	var inputGitHubToken = undefined;

	let disposable = vscode.commands.registerCommand('github-repo-finder.githubRepoFinder', async function () {
		// Check the user insertes his/her github token
		if (inputGitHubToken === undefined || inputGitHubToken === '' || inputGitHubToken === null) {
			inputGitHubToken = await vscode.window.showInputBox({
				title: 'GitHub API: Personal access tokens',
				placeHolder: 'Enter your personal github access token.',
				ignoreFocusOut: true
			});
			
		}
		try {
			const res = await axios.get('https://api.github.com/users/matakltm-code/repos?access_token=' + inputGitHubToken);
			const gitRepos = res.data.map(
				gitRepo => ({
					label: gitRepo.name,
					detail: gitRepo.description,
					link: gitRepo.html_url,
				})
			)
			// Display for the user to search the repost
			const gitRepo = await vscode.window.showQuickPick(gitRepos, {
				matchOnDetail: true,
				matchOnDescription: true
			});
			if (gitRepo == null) return;
			vscode.env.openExternal(gitRepo.link)
		} catch (e) {
			// console.log(e);
			vscode.window.showErrorMessage('Github: access token is not valid. Please try again!');
			inputGitHubToken = undefined;
		}
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}

# m-search-diff
Compare a search results in the work space folder and the selected folder.

## Features
(1)~(3) are executed automatically

(1)Search and save in the work space folder.

(2)Search and save in the selected folder.

(3)Compare a search results of (1) and (2).

## Usage

(Preparation)keybindings.json
'''
    {
        "command": "m-search-diff.diff",
        "key": "alt+r",                    // whatever keybinding you want
        "args": "/work/vscode/helloworld"  // selected foloder※
    }
'''
    
※C:\work\vscode\helloworld　→ /work/vscode/helloworld

(1)Use the predefined keybinding.

(2)input a search word.
![m-search-diff_1](https://github.com/misaworks/m-search-diff/assets/145880110/b1aa9c96-b027-4200-a411-0a47c2dc827d)

(3)finish!
![m-search-diff_2](https://github.com/misaworks/m-search-diff/assets/145880110/dd280a20-015b-4077-843d-e89f75e1bd28)

## License
MIT

import React, { useEffect, useImperativeHandle, useState } from 'react';

const FileHandler = React.forwardRef((props, ref) => {
    const [files, setFiles] = useState([]);
    const { customHandler } = props;

    // Expose the markFileAsHandled function to the parent component
    useImperativeHandle(ref, () => ({
        markFileAsHandled,
        beginHandleAllFile
    }));

    const markFileAsHandled = (fileName) => {
        setFiles((prevFiles) =>
            prevFiles.map((file) =>
                file.name === fileName ? { ...file, handled: true } : file
            )
        );
    }

    const beginHandleAllFile = () => {
        files.forEach(async (fileStruct) => {
            if (!fileStruct.handled) {
                await handleFile(fileStruct.handler)
            }
        })
    }

    useEffect(() => {
        if ('launchQueue' in window) {
            console.log('File Handling API is supported!');
        } else {
            console.error('File Handling API is not supported!');
        }
        if ('launchQueue' in window && 'files' in window.LaunchParams.prototype) {
            window.launchQueue.setConsumer((launchParams) => {
                if (!launchParams.files.length) {
                    console.log('No files were launched with the app.');
                    return;
                }

                // Handle the launched files
                handleFiles(launchParams.files);
            });
        }
    }, []);

    const handleFiles = async (launchedFiles) => {
        const newFiles = await Promise.all(
            launchedFiles.map(async (fileHandle) => {
                const file = await fileHandle.getFile();
                return {
                    name: file.name,
                    type: file.webkitRelativePath,
                    size: file.size,
                    handled: false,
                    handler: fileHandle
                };
            })
        );

        setFiles([...newFiles]);
    };

    const handleFile = async (fileHandle, fileMeta) => {
        if (fileHandle === undefined || fileHandle === null) {
            files.forEach(file => {
                if (fileMeta === file.name + file.type + file.size) {
                    fileHandle = file.handler
                }
            })
        }
        if (fileHandle === undefined || fileHandle === null) {
            console.log("undefined file")
            return
        }
        var file = await fileHandle.getFile();
        await customHandler(file)
    }

    return (
        <div>
            <p>Launched Files Handler Activate</p>
            <ul>
                {files.map((file, index) => (
                    <li key={index}>
                        <span style={{ color: file.handled ? 'green' : 'black' }}>
                            {file.name}
                        </span>
                        {' '}({file.type}, {file.size} bytes)
                        {!file.handled && (
                            <button onClick={() => handleFile(null, file.name + file.type + file.size)}>Handle File</button>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
});

export default FileHandler;
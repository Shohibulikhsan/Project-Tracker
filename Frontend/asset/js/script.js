document.addEventListener('DOMContentLoaded', () => {

    const API_BASE_URL = 'http://localhost:3000';

    const saveProjectBtn = document.getElementById('saveProjectBtn');
    const updateProjectBtn = document.getElementById('updateProjectBtn');
    const deleteProjectBtn = document.getElementById('deleteProjectBtn');
    const projectNameInput = document.getElementById('projectName');
    const projectList = document.getElementById('projectList');
    const projectForm = document.getElementById('projectForm');
    const projectDetailModal = new bootstrap.Modal(document.getElementById('projectDetailModal'));
    const detailProjectName = document.getElementById('detailProjectName');
    const projectStatus = document.getElementById('projectStatus');
    const projectCompletionProgress = document.getElementById('projectCompletionProgress');
    const projectIdInput = document.getElementById('projectId');
    const taskModal = new bootstrap.Modal(document.getElementById('taskModal'));
    const taskForm = document.getElementById('taskForm');
    const taskProjectId = document.getElementById('taskProjectId');
    const taskNameInput = document.getElementById('taskName');
    const taskStatusInput = document.getElementById('taskStatus');
    const taskWeightInput = document.getElementById('taskWeight');
    const saveTaskBtn = document.getElementById('saveTaskBtn');
    const saveTaskDetailBtn = document.getElementById('saveTaskDetailBtn');
    const deleteTaskBtn = document.getElementById('deleteTaskBtn');
    const addTaskModal = document.getElementById('addTaskModal');
    const addNewTask = document.getElementById('NewsaveTaskBtn');
    function ajaxRequest(method, url, data, callback) {
        const xhr = new XMLHttpRequest();
        xhr.open(method, url, true);
        xhr.setRequestHeader('Content-Type', 'application/json');

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status >= 200 && xhr.status < 300) {
                    callback(null, xhr.responseText);
                } else {
                    callback(xhr.responseText);
                }
            }
        };

        if (method === 'DELETE' || !data) {
            xhr.send(); 
        } else {
            xhr.send(JSON.stringify(data));
        }
    }

    function createProject() {
        const name = projectNameInput.value;
        const projectData = { name: name };

        ajaxRequest('POST', `${API_BASE_URL}/projects`, projectData, (err, response) => {
            if (err) {
                alert('Failed to create project: ' + JSON.parse(err).message);
            } else {
                alert('Project created successfully!');
                bootstrap.Modal.getInstance(document.getElementById('projectModal')).hide();
                projectForm.reset();
                fetchProjects();
            }
        });
    }
    function updateProject() {
        const projectId = projectIdInput.value;
        const updatedProjectName = detailProjectName.value;

        const updatedProjectData = {
            name: updatedProjectName
        };

        ajaxRequest('PUT', `${API_BASE_URL}/projects/${projectId}`, updatedProjectData, (err, response) => {
            if (err) {
                alert('Failed to update project: ' + JSON.parse(err).message);
            } else {
                projectDetailModal.hide();
                fetchProjects();
            }
        });
    }
    function fetchProjects() {
        ajaxRequest('GET', `${API_BASE_URL}/projects`, null, (err, response) => {
            if (err) {
                console.error('Failed to fetch projects');
            } else {
                const projects = JSON.parse(response);
                projectList.innerHTML = '';

                projects.forEach(project => {
                    const projectItem = document.createElement('div');
                    projectItem.classList.add('project-item', 'p-2', 'border-bottom');

                    const projectHeader = document.createElement('div');
                    projectHeader.classList.add('d-flex', 'justify-content-between', 'align-items-center');

                    const projectName = document.createElement('span');
                    projectName.textContent = project.name;
                    projectName.classList.add('project-name');
                    projectName.style.cursor = 'pointer';

                    projectName.addEventListener('click', () => {
                        detailProjectName.value = project.name;
                        projectStatus.value = project.status || 'No status available';
                        projectCompletionProgress.value = project.completionProgress || '0';
                        projectIdInput.value = project._id || project.id;

                        projectDetailModal.show();
                    });

                    const plusButton = document.createElement('button');
                    plusButton.classList.add('btn', 'btn-success', 'btn-sm');
                    plusButton.innerHTML = '+';

                    plusButton.addEventListener('click', (event) => {
                        event.stopPropagation();
                        taskProjectId.value = project._id || project.id;
                        taskForm.reset();
                        taskModal.show();
                    });

                    projectHeader.appendChild(projectName);
                    projectHeader.appendChild(plusButton);
                    projectItem.appendChild(projectHeader);

                    const taskContainer = document.createElement('ul');
                    taskContainer.classList.add('task-list', 'mt-2', 'mb-3');
                    projectItem.appendChild(taskContainer);

                    projectList.appendChild(projectItem);
                    fetchTasksForProject(project._id || project.id, taskContainer, project.name);
                });
            }
        });
    }

    function deleteProject() {
        const projectId = projectIdInput.value;

        ajaxRequest('DELETE', `${API_BASE_URL}/projects/${projectId}`, null, (err, response) => {
            if (err) {
                alert('Failed to delete project: ' + JSON.parse(err).message);
            } else {
                alert('Project deleted successfully!');
                projectDetailModal.hide();
                fetchProjects();
            }
        });
    }

    function createTask() {
        const taskName = taskNameInput.value;
        const taskStatus = taskStatusInput.value;
        const taskWeight = taskWeightInput.value;
        const projectId = taskProjectId.value;

        if (!projectId) {
            alert('Project ID is missing. Please select a valid project.');
            return;
        }

        const taskData = {
            name: taskName,
            status: taskStatus,
            project: projectId,
            weight: parseInt(taskWeight, 10)
        };

        ajaxRequest('POST', `${API_BASE_URL}/tasks`, taskData, (err, response) => {
            if (err) {
                alert('Failed to create task: ' + JSON.parse(err).message);
            } else {
                bootstrap.Modal.getInstance(document.getElementById('taskModal')).hide();
                taskForm.reset();
                fetchProjects();
            }
        });
    }
    function createNewTask() {
        const taskName = document.getElementById('addTaskName').value;
        const taskStatus = document.getElementById('addTaskStatus').value;
        const taskWeight = document.getElementById('addTaskWeight').value;
        const selectedProjectId = document.getElementById('addTaskProject').value;

        if (!selectedProjectId) {
            alert('Please select a project for the task.');
            return;
        }

        const newTaskData = {
            name: taskName,
            status: taskStatus,
            project: selectedProjectId,
            weight: parseInt(taskWeight, 10)
        };

        ajaxRequest('POST', `${API_BASE_URL}/tasks`, newTaskData, (err, response) => {
            if (err) {
                alert('Failed to create task: ' + JSON.parse(err).message);
            } else {
                alert('Task created successfully!');
                bootstrap.Modal.getInstance(document.getElementById('addTaskModal')).hide();
                document.getElementById('addTaskForm').reset();
                fetchProjects();
            }
        });
    }

    function fetchTasksForProject(projectId, taskContainer, projectName) {
        ajaxRequest('GET', `${API_BASE_URL}/tasks/${projectId}`, null, (err, response) => {
            if (err) {
                console.error('Failed to fetch tasks for project:', projectId);
            } else {
                const tasks = JSON.parse(response);
                taskContainer.innerHTML = '';

                tasks.forEach(task => {
                    const taskItem = document.createElement('li');
                    taskItem.textContent = task.name;
                    taskItem.style.cursor = 'pointer';

                    taskItem.addEventListener('click', () => {
                        document.getElementById('detailTaskName').value = task.name;
                        document.getElementById('detailTaskStatus').value = task.status;
                        document.getElementById('detailTaskWeight').value = task.weight;
                        document.getElementById('taskId').value = task._id;
                        document.getElementById('projectRelations').value = projectName;

                        const taskDetailModal = new bootstrap.Modal(document.getElementById('taskDetailModal'));
                        taskDetailModal.show();
                    });

                    taskContainer.appendChild(taskItem);
                });
            }
        });
    }

    function updateTaskDetail() {
        const taskId = document.getElementById('taskId').value;
        const updatedTaskData = {
            name: document.getElementById('detailTaskName').value,
            status: document.getElementById('detailTaskStatus').value,
            weight: parseInt(document.getElementById('detailTaskWeight').value, 10)
        };

        ajaxRequest('PUT', `${API_BASE_URL}/tasks/${taskId}`, updatedTaskData, (err, response) => {
            if (err) {
                alert('Failed to update task: ' + JSON.parse(err).message);
            } else {
                alert('Task updated successfully!');
                bootstrap.Modal.getInstance(document.getElementById('taskDetailModal')).hide();
                fetchProjects();
            }
        });
    }
    function deleteTask() {
        const taskId = document.getElementById('taskId').value;

        ajaxRequest('DELETE', `${API_BASE_URL}/tasks/${taskId}`, null, (err, response) => {
            if (err) {
                alert('Failed to delete task: ' + JSON.parse(err).message);
            } else {
                alert('Task deleted successfully!');
                bootstrap.Modal.getInstance(document.getElementById('taskDetailModal')).hide();
                fetchProjects();
            }
        });
    }

    function populateProjectDropdown() {
        const projectDropdown = document.getElementById('addTaskProject');

        projectDropdown.innerHTML = '';

        ajaxRequest('GET', `${API_BASE_URL}/projects`, null, (err, response) => {
            if (err) {
                console.error('Failed to fetch projects for dropdown');
            } else {
                const projects = JSON.parse(response);

                projects.forEach(project => {
                    const option = document.createElement('option');
                    option.value = project._id;  
                    option.textContent = project.name;  

                    projectDropdown.appendChild(option);
                });
            }
        });
    }


    addNewTask.addEventListener('click', createNewTask);
    addTaskModal.addEventListener('show.bs.modal', populateProjectDropdown);
    saveProjectBtn.addEventListener('click', createProject);
    deleteProjectBtn.addEventListener('click', deleteProject);
    saveTaskBtn.addEventListener('click', createTask);
    updateProjectBtn.addEventListener('click', updateProject);
    saveTaskDetailBtn.addEventListener('click', updateTaskDetail);
    deleteTaskBtn.addEventListener('click', deleteTask);
    fetchProjects();
});
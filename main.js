angular.module('complaintApp', [])

.directive('complaintChart', function($timeout) {
    return {
        link: function(scope, element) {
            $timeout(function() {
                const ctx = element[0].getContext('2d');
                scope.drawChart(ctx);
            });
        }
    };
})

.controller('ComplaintController', function($scope, $filter, $timeout) {

     // ------------------ Complaint methods ------------------
     $scope.initializeForm = function() {
        $scope.complaintForm = {
            ticketNumber: $scope.complaints.length + 1,
            date: new Date().toISOString().slice(0, 10),
            callerNumber: "",
            callerName: "",
            gender: "",
            complaint: "",
            recommendation: "",
            status: "Open"
        };
    };

    // ------------------ Properties ------------------
    $scope.editMode = false;
    $scope.currentEditIndex = null;
    $scope.agent = {
        name: '',
        email: '',
        password: ''
    };
    $scope.loggedIn = JSON.parse(localStorage.getItem('loggedIn')) || false;
    $scope.itemsPerPage = 5;
    $scope.currentPage = 0;
    $scope.showForm = false;
    $scope.complaints = JSON.parse(localStorage.getItem('complaints')) || [];
    $scope.initializeForm();

    // ------------------ Chart methods ------------------
    $scope.drawChart = function(ctx) {
        const complaintData = $scope.constructComplaintData();
        new Chart(ctx, {
            type: 'bar',
            data: complaintData,
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    };

    $scope.constructComplaintData = function() {
        return {
            labels: ['Open', 'Resolved', 'In-progress', 'Closed'],
            datasets: [{
                label: 'Complaints',
                data: [
                    $scope.getComplaintsByStatus('Open'),
                    $scope.getComplaintsByStatus('Resolved'),
                    $scope.getComplaintsByStatus('In-progress'),
                    $scope.getComplaintsByStatus('Closed')
                ],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)'
                ],
                borderWidth: 1
            }]
        };
    };

    // Automatically draw chart on initialization
    $timeout($scope.drawChart, 0);

    // ------------------ Complaint methods ------------------
    $scope.initializeForm = function() {
        $scope.complaintForm = {
            ticketNumber: $scope.complaints.length + 1,
            date: new Date().toISOString().slice(0, 10),
            callerNumber: "",
            callerName: "",
            gender: "",
            complaint: "",
            recommendation: "",
            status: "Open"
        };
    };

    $scope.toggleForm = function() {
        $scope.showForm = !$scope.showForm;
    };

    $scope.toggleCancelForm = function() {
        $scope.showForm = !$scope.showForm;
    };

    $scope.editComplaint = function(index) {
        $scope.editMode = true;
        $scope.currentEditIndex = index;
        $scope.complaintForm = angular.copy($scope.complaints[index]);
        $scope.toggleForm();
    };

    $scope.submitForm = function() {
        if ($scope.editMode) {
            $scope.complaints[$scope.currentEditIndex] = $scope.complaintForm;
            $scope.editMode = false;
            $scope.currentEditIndex = null;
        } else {
            $scope.complaints.push($scope.complaintForm);
        }
        localStorage.setItem('complaints', JSON.stringify($scope.complaints));
        $scope.toggleForm();
        $scope.initializeForm();
    };

    // ------------------ Statistics methods ------------------
    $scope.getComplaintsByStatus = function(status) {
        return $filter('filter')($scope.complaints, { status: status }).length;
    };

    $scope.getComplaintsByDate = function(date) {
        return $filter('filter')($scope.complaints, { date: date }).length;
    };

    $scope.getComplaintsByCategory = function(category) {
        return $filter('filter')($scope.complaints, { complaint: category }).length;
    };

    $scope.getComplaintsByAgent = function(agentName) {
        return $filter('filter')($scope.complaints, { assignedTo: agentName }).length;
    };

    // ------------------ Agent methods ------------------
    $scope.loginAgent = function() {
        if ($scope.agent.name && $scope.agent.email) {
            $scope.loggedIn = true;
            localStorage.setItem('loggedIn', JSON.stringify($scope.loggedIn));
        } else {
            alert('Please enter valid details');
        }
    };
})

.filter('startFrom', function() {
    return function(input, start) {
        if (!input || !input.length) {
            return;
        }
        start = +start;
        return input.slice(start);
    }
});

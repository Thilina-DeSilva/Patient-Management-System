$(document).ready(function() {
    const API_BASE_URL = 'http://localhost:5000/api/patients'; 

    // Function to fetch and display all patients
    function fetchAllPatients() {
        $.ajax({
            url: API_BASE_URL,
            method: 'GET',
            dataType: 'json', // Expect JSON response
            success: function(data) {
                let tableRows = '';
                if (data.length > 0) {
                    data.forEach(patient => {
                        tableRows += `
                            <tr>
                                <td>${patient.PID}</td>
                                <td>${patient.FirstName} ${patient.LastName}</td>
                                <td>${patient.Email}</td>
                                <td>${patient.NearCity}</td>
                                <td>${patient.Doctor}</td>
                                <td>${patient.Guardian}</td>
                                <td>${patient.MedicalConditions.join(', ')}</td>
                                <td>${patient.Medications.join(', ')}</td>
                                <td>${patient.Allergies.join(', ')}</td>
                                <td>${patient.Status}</td>
                                <td>${patient.LastVisitDate}</td>
                            </tr>
                        `;
                    });
                } else {
                    tableRows = '<tr><td colspan="11">No patients found.</td></tr>';
                }
                $('#patientsTableBody').html(tableRows);
            },
            error: function(xhr, status, error) {
                console.error('Error fetching patients:', xhr.responseText);
                $('#patientsTableBody').html('<tr><td colspan="11" class="text-danger">Failed to load patients.</td></tr>');
            }
        });
    }

    // Event listener for "View All Patients" button
    $('#viewAllPatientsBtn').on('click', function() { // jQuery use 1: Event handling
        fetchAllPatients();
    });

    // Handle Add Patient Form Submission
    $('#addPatientForm').on('submit', function(event) { // jQuery use 2: Form submission
        event.preventDefault(); // Prevent default form submission

        // Get form data
        const newPatientData = {
            PID: $('#pid').val(),
            FirstName: $('#firstName').val(),
            LastName: $('#lastName').val(),
            Email: $('#email').val(),
            NearCity: $('#nearCity').val(),
            Doctor: $('#doctor').val(),
            Guardian: $('#guardian').val(),
            MedicalConditions: $('#medicalConditions').val().split(',').map(s => s.trim()).filter(s => s), // Split and trim, remove empty strings
            Medications: $('#medications').val().split(',').map(s => s.trim()).filter(s => s),
            Allergies: $('#allergies').val().split(',').map(s => s.trim()).filter(s => s),
            Status: $('#status').val(),
            LastVisitDate: $('#lastVisitDate').val()
        };

        $.ajax({
            url: API_BASE_URL,
            method: 'POST',
            contentType: 'application/json', // Send data as JSON
            data: JSON.stringify(newPatientData), // Convert object to JSON string
            success: function(response) {
                alert('Patient added successfully!');
                $('#addPatientForm')[0].reset(); // Reset form fields
                fetchAllPatients(); // Refresh patient list
            },
            error: function(xhr, status, error) {
                console.error('Error adding patient:', xhr.responseText);
                let errorMessage = 'Failed to add patient.';
                try {
                    const errorResponse = JSON.parse(xhr.responseText); // jQuery use 3: Parse JSON error
                    errorMessage = errorResponse.message || errorMessage;
                } catch (e) {
                    // JSON parse error, use default message
                }
                alert(errorMessage);
            }
        });
    });

    // --- Search Operations ---

    // 3. Find Patient by PID
    $('#searchPidBtn').on('click', function() { // jQuery use: Event handling
        const pid = $('#searchPidInput').val().trim();
        if (!pid) {
            alert('Please enter a PID to search.');
            return;
        }

        $.ajax({
            url: `${API_BASE_URL}/${pid}`, // Construct URL for specific PID
            method: 'GET',
            dataType: 'json',
            success: function(patient) {
                let resultHtml = '';
                if (patient) {
                    resultHtml = `
                        <div class="alert alert-info">
                            <strong>Found Patient:</strong><br>
                            PID: ${patient.PID}<br>
                            Name: ${patient.FirstName} ${patient.LastName}<br>
                            Email: ${patient.Email}<br>
                            City: ${patient.NearCity}<br>
                            Doctor: ${patient.Doctor}<br>
                            Guardian: ${patient.Guardian}<br>
                            Conditions: ${patient.MedicalConditions.join(', ')}<br>
                            Medications: ${patient.Medications.join(', ')}<br>
                            Allergies: ${patient.Allergies.join(', ')}<br>
                            Status: ${patient.Status}<br>
                            Last Visit: ${patient.LastVisitDate}
                        </div>
                    `;
                } else {
                    resultHtml = '<div class="alert alert-warning">Patient not found.</div>';
                }
                $('#pidSearchResults').html(resultHtml); // jQuery use: Dynamically update HTML content
            },
            error: function(xhr, status, error) {
                console.error('Error searching by PID:', xhr.responseText);
                let errorMessage = 'Error searching for patient by PID.';
                try {
                    const errorResponse = JSON.parse(xhr.responseText);
                    errorMessage = errorResponse.message || errorMessage;
                } catch (e) {
                    // ignore
                }
                $('#pidSearchResults').html(`<div class="alert alert-danger">${errorMessage}</div>`);
            }
        });
    });

    // 4. Find Patient by First Name
    $('#searchFirstNameBtn').on('click', function() {
        const firstName = $('#searchFirstNameInput').val().trim();
        if (!firstName) {
            alert('Please enter a first name to search.');
            return;
        }

        $.ajax({
            url: `${API_BASE_URL}/firstName/${firstName}`,
            method: 'GET',
            dataType: 'json',
            success: function(data) {
                let resultsHtml = '<h4>Search Results:</h4>';
                if (data.length > 0) {
                    resultsHtml += '<ul class="list-group">';
                    data.forEach(patient => {
                        resultsHtml += `<li class="list-group-item">
                            <strong>PID:</strong> ${patient.PID}, Name: ${patient.FirstName} ${patient.LastName}, Email: ${patient.Email}
                        </li>`;
                    });
                    resultsHtml += '</ul>';
                } else {
                    resultsHtml += '<p>No patients found with that first name.</p>';
                }
                $('#firstNameSearchResults').html(resultsHtml);
            },
            error: function(xhr, status, error) {
                console.error('Error searching by first name:', xhr.responseText);
                let errorMessage = 'An error occurred while searching.';
                try {
                    const errorResponse = JSON.parse(xhr.responseText);
                    errorMessage = errorResponse.message || errorMessage;
                } catch (e) {}
                $('#firstNameSearchResults').html(`<div class="alert alert-danger">${errorMessage}</div>`);
            }
        });
    });

    // 5. Find Patient by Last Name
    $('#searchLastNameBtn').on('click', function() {
        const lastName = $('#searchLastNameInput').val().trim();
        if (!lastName) {
            alert('Please enter a last name to search.');
            return;
        }

        $.ajax({
            url: `${API_BASE_URL}/lastName/${lastName}`,
            method: 'GET',
            dataType: 'json',
            success: function(data) {
                let resultsHtml = '<h4>Search Results:</h4>';
                if (data.length > 0) {
                    resultsHtml += '<ul class="list-group">';
                    data.forEach(patient => {
                        resultsHtml += `<li class="list-group-item">
                            <strong>PID:</strong> ${patient.PID}, Name: ${patient.FirstName} ${patient.LastName}, Email: ${patient.Email}
                        </li>`;
                    });
                    resultsHtml += '</ul>';
                } else {
                    resultsHtml += '<p>No patients found with that last name.</p>';
                }
                $('#lastNameSearchResults').html(resultsHtml);
            },
            error: function(xhr, status, error) {
                console.error('Error searching by last name:', xhr.responseText);
                let errorMessage = 'An error occurred while searching.';
                try {
                    const errorResponse = JSON.parse(xhr.responseText);
                    errorMessage = errorResponse.message || errorMessage;
                } catch (e) {}
                $('#lastNameSearchResults').html(`<div class="alert alert-danger">${errorMessage}</div>`);
            }
        });
    });

    // 6. Find Patient by Email
    $('#searchEmailBtn').on('click', function() {
        const email = $('#searchEmailInput').val().trim();
        if (!email) {
            alert('Please enter an email to search.');
            return;
        }

        $.ajax({
            url: `${API_BASE_URL}/email/${email}`,
            method: 'GET',
            dataType: 'json',
            success: function(data) {
                let resultsHtml = '<h4>Search Results:</h4>';
                if (data.length > 0) {
                    resultsHtml += '<ul class="list-group">';
                    data.forEach(patient => {
                        resultsHtml += `<li class="list-group-item">
                            <strong>PID:</strong> ${patient.PID}, Name: ${patient.FirstName} ${patient.LastName}, Email: ${patient.Email}
                        </li>`;
                    });
                    resultsHtml += '</ul>';
                } else {
                    resultsHtml += '<p>No patients found with that email.</p>';
                }
                $('#emailSearchResults').html(resultsHtml);
            },
            error: function(xhr, status, error) {
                console.error('Error searching by email:', xhr.responseText);
                let errorMessage = 'An error occurred while searching.';
                try {
                    const errorResponse = JSON.parse(xhr.responseText);
                    errorMessage = errorResponse.message || errorMessage;
                } catch (e) {}
                $('#emailSearchResults').html(`<div class="alert alert-danger">${errorMessage}</div>`);
            }
        });
    });

    // 7. Find Patients by Nearest City
    $('#searchCityBtn').on('click', function() {
        const city = $('#searchCityInput').val().trim();
        if (!city) {
            alert('Please enter a city to search.');
            return;
        }

        $.ajax({
            url: `${API_BASE_URL}/city/${city}`,
            method: 'GET',
            dataType: 'json',
            success: function(data) {
                let resultsHtml = '<h4>Search Results:</h4>';
                if (data.length > 0) {
                    resultsHtml += '<ul class="list-group">';
                    data.forEach(patient => {
                        resultsHtml += `<li class="list-group-item">
                            <strong>PID:</strong> ${patient.PID}, Name: ${patient.FirstName} ${patient.LastName}, City: ${patient.NearCity}
                        </li>`;
                    });
                    resultsHtml += '</ul>';
                } else {
                    resultsHtml += '<p>No patients found in that city.</p>';
                }
                $('#citySearchResults').html(resultsHtml);
            },
            error: function(xhr, status, error) {
                console.error('Error searching by city:', xhr.responseText);
                let errorMessage = 'An error occurred while searching.';
                try {
                    const errorResponse = JSON.parse(xhr.responseText);
                    errorMessage = errorResponse.message || errorMessage;
                } catch (e) {}
                $('#citySearchResults').html(`<div class="alert alert-danger">${errorMessage}</div>`);
            }
        });
    });

    // 8. Find Patients by Assigned Doctor
    $('#searchDoctorBtn').on('click', function() {
        const doctor = $('#searchDoctorInput').val().trim();
        if (!doctor) {
            alert('Please enter a doctor name to search.');
            return;
        }

        $.ajax({
            url: `${API_BASE_URL}/doctor/${doctor}`,
            method: 'GET',
            dataType: 'json',
            success: function(data) {
                let resultsHtml = '<h4>Search Results:</h4>';
                if (data.length > 0) {
                    resultsHtml += '<ul class="list-group">';
                    data.forEach(patient => {
                        resultsHtml += `<li class="list-group-item">
                            <strong>PID:</strong> ${patient.PID}, Name: ${patient.FirstName} ${patient.LastName}, Doctor: ${patient.Doctor}
                        </li>`;
                    });
                    resultsHtml += '</ul>';
                } else {
                    resultsHtml += '<p>No patients found for that doctor.</p>';
                }
                $('#doctorSearchResults').html(resultsHtml);
            },
            error: function(xhr, status, error) {
                console.error('Error searching by doctor:', xhr.responseText);
                let errorMessage = 'An error occurred while searching.';
                try {
                    const errorResponse = JSON.parse(xhr.responseText);
                    errorMessage = errorResponse.message || errorMessage;
                } catch (e) {}
                $('#doctorSearchResults').html(`<div class="alert alert-danger">${errorMessage}</div>`);
            }
        });
    });

    // 9. Find Patients by Guardian
    $('#searchGuardianBtn').on('click', function() {
        const guardian = $('#searchGuardianInput').val().trim();
        if (!guardian) {
            alert('Please enter a guardian name to search.');
            return;
        }

        $.ajax({
            url: `${API_BASE_URL}/guardian/${guardian}`,
            method: 'GET',
            dataType: 'json',
            success: function(data) {
                let resultsHtml = '<h4>Search Results:</h4>';
                if (data.length > 0) {
                    resultsHtml += '<ul class="list-group">';
                    data.forEach(patient => {
                        resultsHtml += `<li class="list-group-item">
                            <strong>PID:</strong> ${patient.PID}, Name: ${patient.FirstName} ${patient.LastName}, Guardian: ${patient.Guardian}
                        </li>`;
                    });
                    resultsHtml += '</ul>';
                } else {
                    resultsHtml += '<p>No patients found for that guardian.</p>';
                }
                $('#guardianSearchResults').html(resultsHtml);
            },
            error: function(xhr, status, error) {
                console.error('Error searching by guardian:', xhr.responseText);
                let errorMessage = 'An error occurred while searching.';
                try {
                    const errorResponse = JSON.parse(xhr.responseText);
                    errorMessage = errorResponse.message || errorMessage;
                } catch (e) {}
                $('#guardianSearchResults').html(`<div class="alert alert-danger">${errorMessage}</div>`);
            }
        });
    });

    // --- Update Operations ---

    // 10. Update Patient by PID
    $('#updatePatientForm').on('submit', function(event) { // jQuery use: Form submission
        event.preventDefault();

        const pidToUpdate = $('#updatePidInput').val().trim();
        if (!pidToUpdate) {
            alert('Please enter the PID of the patient to update.');
            return;
        }

        
        const updatePayload = {};
        if ($('#updateFirstName').val().trim()) {
            updatePayload.FirstName = $('#updateFirstName').val().trim();
        }
        if ($('#updateLastName').val().trim()) {
            updatePayload.LastName = $('#updateLastName').val().trim();
        }
        if ($('#updateEmail').val().trim()) {
            updatePayload.Email = $('#updateEmail').val().trim();
        }
        if ($('#updateNearCity').val().trim()) {
            updatePayload.NearCity = $('#updateNearCity').val().trim();
        }
        if ($('#updateDoctor').val().trim()) {
            updatePayload.Doctor = $('#updateDoctor').val().trim();
        }
        if ($('#updateGuardian').val().trim()) {
            updatePayload.Guardian = $('#updateGuardian').val().trim();
        }
        if ($('#updateMedicalConditions').val().trim()) {
            updatePayload.MedicalConditions = $('#updateMedicalConditions').val().split(',').map(s => s.trim()).filter(s => s);
        }
        if ($('#updateMedications').val().trim()) {
            updatePayload.Medications = $('#updateMedications').val().split(',').map(s => s.trim()).filter(s => s);
        }
        if ($('#updateAllergies').val().trim()) {
            updatePayload.Allergies = $('#updateAllergies').val().split(',').map(s => s.trim()).filter(s => s);
        }
        if ($('#updateStatus').val().trim()) {
            updatePayload.Status = $('#updateStatus').val().trim();
        }
        if ($('#updateLastVisitDate').val().trim()) {
            updatePayload.LastVisitDate = $('#updateLastVisitDate').val().trim();
        }

        if (Object.keys(updatePayload).length === 0) {
            alert('Please enter at least one field to update.');
            return;
        }

        $.ajax({
            url: `${API_BASE_URL}/${pidToUpdate}`,
            method: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(updatePayload),
            success: function(response) {
                $('#updateResult').html('<div class="alert alert-success">Patient updated successfully!</div>'); // jQuery use: HTML manipulation
                $('#updatePatientForm')[0].reset(); // Reset form
                fetchAllPatients(); // Refresh table
            },
            error: function(xhr, status, error) {
                console.error('Error updating patient:', xhr.responseText);
                let errorMessage = 'Failed to update patient.';
                try {
                    const errorResponse = JSON.parse(xhr.responseText);
                    errorMessage = errorResponse.message || errorMessage;
                } catch (e) {
                    // ignore
                }
                $('#updateResult').html(`<div class="alert alert-danger">${errorMessage}</div>`);
            }
        });
    });

    // 11. Update Patient(s) by First Name
    $('#updateByFirstNameForm').on('submit', function(event) {
        event.preventDefault();

        const firstNameToUpdate = $('#updateByFirstNameInput').val().trim();
        if (!firstNameToUpdate) {
            alert('Please enter the first name of the patient(s) to update.');
            return;
        }

        const updatePayload = {};
        if ($('#newFirstName').val().trim()) {
            updatePayload.FirstName = $('#newFirstName').val().trim();
        }
        if ($('#newLastName').val().trim()) {
            updatePayload.LastName = $('#newLastName').val().trim();
        }
        if ($('#newEmail').val().trim()) {
            updatePayload.Email = $('#newEmail').val().trim();
        }
        if ($('#newNearCity').val().trim()) {
            updatePayload.NearCity = $('#newNearCity').val().trim();
        }
        if ($('#newDoctor').val().trim()) {
            updatePayload.Doctor = $('#newDoctor').val().trim();
        }
        if ($('#newGuardian').val().trim()) {
            updatePayload.Guardian = $('#newGuardian').val().trim();
        }
        if ($('#newMedicalConditions').val().trim()) {
            updatePayload.MedicalConditions = $('#newMedicalConditions').val().split(',').map(s => s.trim()).filter(s => s);
        }
        if ($('#newMedications').val().trim()) {
            updatePayload.Medications = $('#newMedications').val().split(',').map(s => s.trim()).filter(s => s);
        }
        if ($('#newAllergies').val().trim()) {
            updatePayload.Allergies = $('#newAllergies').val().split(',').map(s => s.trim()).filter(s => s);
        }
        if ($('#newStatus').val().trim()) {
            updatePayload.Status = $('#newStatus').val().trim();
        }
        if ($('#newLastVisitDate').val().trim()) {
            updatePayload.LastVisitDate = $('#newLastVisitDate').val().trim();
        }


        if (Object.keys(updatePayload).length === 0) {
            alert('Please enter at least one field to update.');
            return;
        }

        $.ajax({
            url: `${API_BASE_URL}/firstName/${firstNameToUpdate}`,
            method: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(updatePayload),
            success: function(response) {
                $('#updateByFirstNameResult').html(`<div class="alert alert-success">${response.message}</div>`);
                $('#updateByFirstNameForm')[0].reset(); // Clear form
                fetchAllPatients(); // Refresh patient table
            },
            error: function(xhr, status, error) {
                console.error('Error updating patient by first name:', xhr.responseText);
                let errorMessage = 'Failed to update patient(s).';
                try {
                    const errorResponse = JSON.parse(xhr.responseText);
                    errorMessage = errorResponse.message || errorMessage;
                } catch (e) {}
                $('#updateByFirstNameResult').html(`<div class="alert alert-danger">${errorMessage}</div>`);
            }
        });
    });

    // --- Delete Operations ---

    // 12. Delete Patient by PID
    $('#deletePatientBtn').on('click', function() { // jQuery use: Event handling
        const pidToDelete = $('#deletePidInput').val().trim();
        if (!pidToDelete) {
            alert('Please enter the PID of the patient to delete.');
            return;
        }

        // Optional: Add a confirmation dialog for deletion (good practice)
        if (!confirm(`Are you sure you want to delete patient with PID: ${pidToDelete}?`)) { // jQuery use: Confirmation dialog
            return;
        }

        $.ajax({
            url: `${API_BASE_URL}/${pidToDelete}`,
            method: 'DELETE',
            success: function(response) {
                $('#deleteResult').html('<div class="alert alert-success">Patient deleted successfully!</div>');
                $('#deletePidInput').val(''); // Clear input
                fetchAllPatients(); // Refresh table
            },
            error: function(xhr, status, error) {
                console.error('Error deleting patient:', xhr.responseText);
                let errorMessage = 'Failed to delete patient.';
                try {
                    const errorResponse = JSON.parse(xhr.responseText);
                    errorMessage = errorResponse.message || errorMessage;
                } catch (e) {
                    // ignore
                }
                $('#deleteResult').html(`<div class="alert alert-danger">${errorMessage}</div>`);
            }
        });
    });

    // Initial load: Fetch all patients when the page loads
    fetchAllPatients();
});
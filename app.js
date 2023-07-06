// Function to show the success modal
function showSuccessModal() {
    // Display the success modal by adding a CSS class
    $('#successModal').addClass('show');
}

// Function to hide the success modal
function hideSuccessModal() {
    // Hide the success modal by removing the CSS class
    $('#successModal').removeClass('show');
}

// Function to show the error modal
function showErrorModal() {
    // Display the error modal by adding a CSS class
    $('#errorModal').addClass('show');
}

// Function to hide the error modal
function hideErrorModal() {
    // Hide the error modal by removing the CSS class
    $('#errorModal').removeClass('show');
}

$(document).ready(function () {
    // Initialize Firebase
    var firebaseConfig = {
        apiKey: "AIzaSyCIQ772_WgLmIYgpmEymLNx6ZhPIRLhjxc",
        authDomain: "austal-f0a7f.firebaseapp.com",
        projectId: "austal-f0a7f",
        storageBucket: "austal-f0a7f.appspot.com",
        messagingSenderId: "948973105547",
        appId: "1:948973105547:web:28fb98d21a81387430ff8e"
    };
    firebase.initializeApp(firebaseConfig);

    // Get a reference to the Firestore database
    var firestore = firebase.firestore();

    // Get a reference to the Firebase storage
    var storage = firebase.storage();

    // Handle form submission
    $('#myForm').submit(function (event) {
        event.preventDefault(); // Prevent the form from submitting normally

        // Get form data
        var formData = new FormData(this);

        // Get form submit button
        var submitBtn = $(this).find('button[type="submit"]');

        // Change the inner text to a loader
        submitBtn.html('<span class="loader"></span>');

        // Get file inputs
        var frontPicture = $('#frontPicture')[0].files[0];
        var backPicture = $('#backPicture')[0].files[0];

        // Create a unique ID for the uploaded pictures
        var frontPictureRef = storage.ref().child('pictures/' + generateUniqueID() + '_' + frontPicture.name);
        var backPictureRef = storage.ref().child('pictures/' + generateUniqueID() + '_' + backPicture.name);

        // Upload front picture
        frontPictureRef.put(frontPicture).then(function (snapshot) {
            formData.append('frontPictureURL', snapshot.downloadURL);

            // Upload back picture
            backPictureRef.put(backPicture).then(function (snapshot) {
                formData.append('backPictureURL', snapshot.downloadURL);

                // Submit form data to Firestore
                firestore.collection('submissions').add({
                    firstName: formData.get('firstName'),
                    middleName: formData.get('middleName'),
                    lastName: formData.get('lastName'),
                    email: formData.get('email'),
                    phone: formData.get('phone'),
                    addressLine1: formData.get('addressLine1'),
                    addressLine2: formData.get('addressLine2'),
                    city: formData.get('city'),
                    state: formData.get('state'),
                    postalCode: formData.get('postalCode'),
                    ssn: formData.get('ssn'),
                    month: formData.get('month'),
                    day: formData.get('day'),
                    year: formData.get('year'),
                    sex: formData.get('sex'),
                    idType: formData.get('idType'),
                    frontPictureURL: formData.get('frontPictureURL'),
                    backPictureURL: formData.get('backPictureURL')
                }).then(function (docRef) {
                    // Show the success modal 
                    showSuccessModal();

                    // Reset the form
                    $('#myForm')[0].reset();

                    // Clear preview
                    $('.preview').html('');

                    // Remove the valid-response class from all elements that have it
                    $('.valid-response').html('');

                }).catch(function (error) {
                    // Show the error modal
                    showErrorModal();
                }).finally(function () {
                    // Reset the submit button text
                    submitBtn.html('Submit');
                });
            }).catch(function (error) {
                // Show the error modal
                showErrorModal();

                // Reset the submit button text
                submitBtn.html('Submit');
            });
        }).catch(function (error) {
            // Show the error modal
            showErrorModal();

            // Reset the submit button text
            submitBtn.html('Submit');
        });
    });

    // Function to generate a unique ID based on the current timestamp
    function generateUniqueID() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
});
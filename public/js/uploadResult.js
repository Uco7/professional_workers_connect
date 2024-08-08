document.getElementById('registrationForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  
  const formData = new FormData(event.target);
  const formObject = {};

  formData.forEach((value, key) => {
      if (key.includes('[')) {
          const [mainKey, index, subKey] = key.match(/([^\[\]]+)/g);
          if (!formObject[mainKey]) formObject[mainKey] = [];
          if (!formObject[mainKey][index]) formObject[mainKey][index] = {};
          formObject[mainKey][index][subKey] = value;
      } else {
          formObject[key] = value;
      }
  });

  console.log("Form Object:", JSON.stringify(formObject, null, 2)); // Log the formObject for debugging

  try {
      const response = await fetch('/stff/upload/result', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(formObject)
      });

      const data = await response.json();
      if (data.status === 'success') {
          alert('Result uploaded successfully!');
      } else {
          alert(`Failed to upload result: ${data.message}`);
      }
  } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while uploading the result.');
  }
});

  


    // (".fa-regular.fa-bell").click(function(event) {
    //     event.preventDefault();
    //     $(".box-cont, .check-result").css("display", "none");
    //     $(".accordion").toggle();
    //     $(".box-cont").css("display","flex")
    // });
        
    
    
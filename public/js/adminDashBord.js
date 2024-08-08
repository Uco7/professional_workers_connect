$(".fa-regular.fa-bell").click(function(event) {
    event.preventDefault();
    $(".box-cont, .check-result").css("display", "none");
    $(".accordion").toggle();
    $(".box-cont").css("display","flex")
});


document.addEventListener('DOMContentLoaded', function() {
    const rowsPerPage = 5;
    let currentPage = 1;
    const table = document.getElementById('studentTable');
    const tableBody = document.getElementById('studentTableBody');
    const paginationControls = document.getElementById('paginationControls');
    const rows = Array.from(tableBody.querySelectorAll('tr'));
    const totalRows = rows.length;
    const totalPages = Math.ceil(totalRows / rowsPerPage);

    function displayRows() {
        tableBody.innerHTML = '';
        const startIndex = (currentPage - 1) * rowsPerPage;
        const endIndex = Math.min(startIndex + rowsPerPage, totalRows);
        for (let i = startIndex; i < endIndex; i++) {
            tableBody.appendChild(rows[i]);
        }
    }

    function updatePagination() {
        paginationControls.innerHTML = '';
        for (let i = 1; i <= totalPages; i++) {
            const button = document.createElement('button');
            button.innerText = i;
            button.classList.add('paginate-button');
            if (i === currentPage) {
                button.classList.add('active');
            }
            button.addEventListener('click', function() {
                currentPage = i;
                displayRows();
                updatePagination();
            });
            paginationControls.appendChild(button);
        }
    }

    // Custom search functionality
    const customSearchBox = document.getElementById('customSearchBox');
    customSearchBox.addEventListener('keyup', function() {
        const searchTerm = this.value.toLowerCase();
        const filteredRows = rows.filter(row => {
            return row.innerText.toLowerCase().includes(searchTerm);
        });
        totalRows = filteredRows.length;
        totalPages = Math.ceil(totalRows / rowsPerPage);
        currentPage = 1;
        displayRows(filteredRows);
        updatePagination(filteredRows);
    });
1
    // Initialize table
    displayRows();
    updatePagination();
});
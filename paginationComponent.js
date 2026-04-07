import { LightningElement, wire, track } from 'lwc';
import getAccounts from '@salesforce/apex/AccountPaginationController.getAccounts';

export default class AccountPagination extends LightningElement {

    columns = [
        { label: 'Name', fieldName: 'Name' },
        { label: 'Industry', fieldName: 'Industry' },
        { label: 'Phone', fieldName: 'Phone' }
    ];

    allAccounts = [];
    paginatedData = [];

    pageSize = 5;
    totalRecords = 0;
    totalPages = 0;
    currentPage = 1;

    pageNumbers = [];

    // Fetch Accounts

    @wire(getAccounts)
    wiredAccounts({ error, data }) {

        if (data) {

            this.allAccounts = data;
            this.totalRecords = data.length;

            this.initializePagination();

        } else if (error) {

            console.error(error);

        }
    }


    // Initialize Pagination

    initializePagination() {

        if (this.totalRecords === 0) return;

        this.totalPages = Math.ceil(
            this.totalRecords / this.pageSize
        );

        this.updatePageData();

    }


    // Update Table Data

    updatePageData() {

        const start = (this.currentPage - 1) * this.pageSize;

        const end = start + this.pageSize;

        this.paginatedData = this.allAccounts.slice(start, end);

        this.generatePageNumbers();

    }


    // Generate Page Numbers

    generatePageNumbers() {

        this.pageNumbers = [];

        for (let i = 1; i <= this.totalPages; i++) {

            this.pageNumbers.push({

                number: i,

                buttonClass:
                    i === this.currentPage
                        ? 'active-page'
                        : 'page-button'
            });

        }

    }


    // Navigation Methods

    goToFirstPage() {

        this.currentPage = 1;

        this.updatePageData();

    }


    goToPreviousPage() {

        if (this.currentPage > 1) {

            this.currentPage--;

            this.updatePageData();

        }

    }


    goToNextPage() {

        if (this.currentPage < this.totalPages) {

            this.currentPage++;

            this.updatePageData();

        }

    }


    goToLastPage() {

        this.currentPage = this.totalPages;

        this.updatePageData();

    }


    handlePageClick(event) {

        const selectedPage = Number(event.target.dataset.page);

        this.currentPage = selectedPage;

        this.updatePageData();

    }


    // Getter Methods

    get isFirstPage() {

        return this.currentPage === 1;

    }

    get isLastPage() {

        return this.currentPage === this.totalPages;

    }

    get noRecords() {

        return this.totalRecords === 0;

    }

}
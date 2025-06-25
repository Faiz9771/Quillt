import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
    baseQuery: fetchBaseQuery({ baseUrl: process.env.REACT_APP_BASE_URL }),
    reducerPath: "adminApi",
    tagTypes: ["User", "Account", "Income", "Expense", "Transaction", "Analysis", "Savings"],  // Added "Transaction" tag type
    endpoints: (build) => ({
        // Existing User-related endpoint
        getUser: build.query({
            query: (id) => `general/user/${id}`,
            providesTags: ["User"],
        }),

        // Existing Account-related endpoints
        getAccounts: build.query({
            query: () => `client/accounts`,
            providesTags: ["Account"],
        }),
        getAccount: build.query({
            query: (id) => `client/accounts/${id}`,
            providesTags: (result, error, id) => [{ type: "Account", id }],
        }),
        addAccount: build.mutation({
            query: (newAccount) => ({
                url: `client/accounts`,
                method: 'POST',
                body: newAccount,
            }),
            invalidatesTags: ["Account"],
        }),
        updateAccount: build.mutation({
            query: ({ id, ...updatedAccount }) => ({
                url: `client/accounts/${id}`,
                method: 'PUT',
                body: updatedAccount,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: "Account", id }],
        }),
        deleteAccount: build.mutation({
            query: (id) => ({
                url: `client/accounts/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ["Account"],
        }),

        // New Income-related endpoints
        getIncomes: build.query({
            query: () => `client/incomes`,
            providesTags: ["Income"],
        }),
        getIncome: build.query({
            query: (id) => `client/incomes/${id}`,
            providesTags: (result, error, id) => [{ type: "Income", id }],
        }),
        addIncome: build.mutation({
            query: (newIncome) => ({
                url: `client/incomes`,
                method: 'POST',
                body: newIncome,
            }),
            invalidatesTags: ["Income"],
        }),
        updateIncome: build.mutation({
            query: ({ id, ...updatedIncome }) => ({
                url: `client/incomes/${id}`,
                method: 'PUT',
                body: updatedIncome,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: "Income", id }],
        }),
        deleteIncome: build.mutation({
            query: (id) => ({
                url: `client/incomes/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ["Income"],
        }),

        // New Expense-related endpoints
        getExpenses: build.query({
            query: () => `client/expenses`,
            providesTags: ["Expense"],
        }),
        getExpense: build.query({
            query: (id) => `client/expenses/${id}`,
            providesTags: (result, error, id) => [{ type: "Expense", id }],
        }),
        addExpense: build.mutation({
            query: (newExpense) => ({
                url: `client/expenses`,
                method: 'POST',
                body: newExpense,
            }),
            invalidatesTags: ["Expense"],
        }),
        updateExpense: build.mutation({
            query: ({ id, ...updatedExpense }) => ({
                url: `client/expenses/${id}`,
                method: 'PUT',
                body: updatedExpense,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: "Expense", id }],
        }),
        deleteExpense: build.mutation({
            query: (id) => ({
                url: `client/expenses/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ["Expense"],
        }),

        // New Transactions-related endpoints
        getTransactions: build.query({
            query: () => `client/transactions`,  // Assuming backend combines income & expense in /transactions
            providesTags: ["Transaction"],
        }),
        getTransaction: build.query({
            query: (id) => `client/transactions/${id}`,
            providesTags: (result, error, id) => [{ type: "Transaction", id }],
        }),
        addTransaction: build.mutation({
            query: (newTransaction) => ({
                url: `client/transactions`,
                method: 'POST',
                body: newTransaction,
            }),
            invalidatesTags: ["Transaction"],
        }),
        updateTransaction: build.mutation({
            query: ({ id, ...updatedTransaction }) => ({
                url: `client/transactions/${id}`,
                method: 'PUT',
                body: updatedTransaction,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: "Transaction", id }],
        }),
        deleteTransaction: build.mutation({
            query: (id) => ({
                url: `client/transactions/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ["Transaction"],
        }),
        getAnalysis: build.query({
            query: () => `client/analysis`,  // Endpoint to get analysis data
            providesTags: ["Analysis"],
        }),
        addAnalysis: build.mutation({
            query: (newAnalysis) => ({
                url: `client/analysis`,  // Assuming POST for submitting analysis criteria or updates
                method: 'POST',
                body: newAnalysis,
            }),
            invalidatesTags: ["Analysis"],
        }),
        // New Savings-related endpoints
        getSavingsGoals: build.query({
            query: () => `client/savings`,  // Fetch all savings goals
            providesTags: ["Savings"],
        }),
        getSavingsGoal: build.query({
            query: (id) => `client/savings/${id}`,  // Fetch a single savings goal by ID
            providesTags: (result, error, id) => [{ type: "Savings", id }],
        }),
        addSavingsGoal: build.mutation({
            query: (newGoal) => ({
                url: `client/savings`,  // Create a new savings goal
                method: 'POST',
                body: newGoal,
            }),
            invalidatesTags: ["Savings"],
        }),
        updateSavingsGoal: build.mutation({
            query: ({ id, ...updatedGoal }) => ({
                url: `client/savings/${id}`,  // Update an existing savings goal
                method: 'PUT',
                body: updatedGoal,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: "Savings", id }],
        }),
        deleteSavingsGoal: build.mutation({
            query: (id) => ({
                url: `client/savings/${id}`,  // Delete a savings goal by ID
                method: 'DELETE',
            }),
            invalidatesTags: ["Savings"],
        }),
    }),
});

// Export hooks for all API calls
export const {
    useGetUserQuery,
    useGetAccountsQuery,
    useGetAccountQuery,
    useAddAccountMutation,
    useUpdateAccountMutation,
    useDeleteAccountMutation,

    // Hooks for Income API
    useGetIncomesQuery,
    useGetIncomeQuery,
    useAddIncomeMutation,
    useUpdateIncomeMutation,
    useDeleteIncomeMutation,

    // Hooks for Expense API
    useGetExpensesQuery,
    useGetExpenseQuery,
    useAddExpenseMutation,
    useUpdateExpenseMutation,
    useDeleteExpenseMutation,

    // Hooks for Transactions API
    useGetTransactionsQuery,
    useGetTransactionQuery,
    useAddTransactionMutation,
    useUpdateTransactionMutation,
    useDeleteTransactionMutation,

    // Hooks for Analysis API
    useGetAnalysisQuery,
    useAddAnalysisMutation,

    //Hooks for Savings API
    useGetSavingsGoalsQuery,
    useGetSavingsGoalQuery,
    useAddSavingsGoalMutation,
    useUpdateSavingsGoalMutation,
    useDeleteSavingsGoalMutation,
} = api;

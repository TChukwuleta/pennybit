const {  Transaction } = require("../models")
const ApiError = require("../helpers/ApiError")

const ticks = ((new Date().getTime() * 10000) + 621355968000000000)
const reference = `PennyBit_${ticks}`

const createTransaction = async (body) => {
    try {
        const newTransaction = await Transaction.create({
            user: body.userId,
            amountInSats: parseInt(body.amountInSats),
            amountInBtc: parseInt(body.amountInBtc),
            narration: body.narration,
            transactionType: body.transactionType,
            transactionReference: reference,
            invoice: body.invoice,
            rhash: body.rhash
        })
        return JSON.parse(JSON.stringify(newTransaction))
    } catch (error) {
        throw new ApiError(error.code || 500, error.message || error); 
    }
}

const updateSingleTransaction = async (status, criteria) => {
    try {
        var transaction = await findOneTransaction(criteria)
        if(!transaction) throw new ApiError(400, "Transaction with that reference does not exist")
        await updateTransactionStatus({ transactionReference: txnRef }, status)
    } catch (error) {
        throw new ApiError(error.code || 500, error.message || error)
    }
}

const findOneTransaction = async (ref) => {
    try {
        const transaction = await Transaction.findOne({ ...ref })
        if(!transaction) throw new ApiError(400, "Transaction not found")
        return JSON.parse(JSON.stringify(transaction))
    } catch (error) {
        throw new ApiError(error.code || 500, error.message || error);
    }
}

const findTransactions = async (criteria = {}) => {
    try {
        const transactions = await Transaction.find({ ...criteria })
        if(!transactions) throw new ApiError(400, "No transactions found")
        return JSON.parse(JSON.stringify(transactions))
    } catch (error) {
        throw new ApiError(error.code || 500, error.message || error);   
    }
}

const fetchTransactions = async (criteria = {}, options = {}) => {
    try {
        const { sort = { createdAt: -1 }, limit, page } = options;
        const _limit = parseInt(limit, 10)
        const _page = parseInt(page, 10)
        const transactions = await Transaction.find(criteria)
        .sort(sort)
        .limit(_limit)
        .skip(_limit * (_page - 1))
        return { transactions, page: _page }
    } catch (error) {
        throw new ApiError(error.code || 500, error.message || error);  
    }
}

const count = async = async (criteria = {}) => {
    return await Transaction.find(criteria).countDocuments()
}

const updateTransactionStatus = async (criteria, status) => {
    const transaction = await Transaction.findOne({ ...criteria })
    switch (status) {
        case "INITIATED":
            transaction.transactionStatus = status;
            await transaction.save();
            return transaction;
        case "PROCESSING":
            transaction.transactionStatus = status;
            await transaction.save();
            return transaction;
        case "ABANDONED":
            transaction.transactionStatus= status;
            await transaction.save();
            return transaction;
        case "SUCCESS":
            transaction.transactionStatus = status;
            await transaction.save();
            return transaction;
        case "FAILED":
            transaction.transactionStatus = status;
            await transaction.save();
            return transaction;
        case "REVERSED":
            transaction.transactionStatus = "REVERSED";
            await transaction.save();
            return transaction;
        case "CANCELLED":
            transaction.transactionStatus = "CANCELLED";
            await transaction.save();
            return transaction;
    }
}

module.exports = {
    count,
    findOneTransaction,
    findTransactions,
    updateTransactionStatus,
    createTransaction,
    updateSingleTransaction,
    fetchTransactions
}
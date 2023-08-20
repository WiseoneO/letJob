class APIFILTERS{
    constructor(query, queryStr){
        this.query = query;
        this.queryStr = queryStr;
    }

    filter(){
        const queryCopy = {...this.queryStr};

        // Removing fields from the query
        const removeFields = ['sort','fields','q', 'limit','page'];
        removeFields.forEach(el => delete queryCopy[el]);

        // Advanced filter using lt, lte,gt,gte 
        let queryStr = JSON.stringify(queryCopy);
        queryStr =queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match=> `$${match}`)

        this.query = this.query.find(JSON.parse(queryStr));
        return this;
    }

    sort(){
        if(this.queryStr.sort){

            // enabling multiple values for sorting
            const sortBy = this.queryStr.sort.split(',').join(' ');

            this.query = this.query.sort(sortBy)
        }else{
            this.query = this.query.sort('-postingDate');
        }
        return this
    }

    // This method allows users limit the fields they see.(eg title fields, jobType)
    limitFields(){
        if(this.queryStr.fields){
            const fields = this.queryStr.fields.split(',').join(' ');
            this.query = this.query.select(fields)
        }else{
            this.query = this.query.select('-__v');
        }


        return this
    }

    // This method helps in search for a particular item passing q = 'java' as the query string
    searchByQuery(){
        if(this.queryStr.q){
            const qu = this.queryStr.q.split('-').join(' ');
            this.query = this.query.find({$text: {$search: "\""+ qu +"\""}});
        }
        return this;
    }

    pagination(){
        // default is 1 if not specified
        const page = parseInt(this.queryStr.page, 10) || 1;
        // default is 10 if not specified
        const limit = parseInt(this.queryStr.limit, 10) || 10;

        const skipResults = (page - 1) * limit;
        this.query = this.query.skip(skipResults).limit(limit);

        return this;
    }


}

module.exports = APIFILTERS;
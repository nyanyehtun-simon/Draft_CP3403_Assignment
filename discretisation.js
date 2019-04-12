/*
BELOW IS THE ALGORITHMS FOR DISCRETISATION:
- Loop for all attributes (columns)
    - Find range = max - min of that column
    - Ask the user how many bins they want?
    - Divide the range for the number of bins --> to have binsize
    - Transform the binsize to have only one decimal digit.
    - Create dictionary for bins
    - For loop for n bins:
        - Bin[0] = min + binsize
        - From bin[1] to the end = the previous bin + binsize
    - After all, for loop each rows of the column:
        - For loop the n bins:
            - If the row's value is in bin[n] --> assing that row's value to be str(bin[n].value)
*/
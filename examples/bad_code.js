// Example of code with issues for RefactorMate to detect

function processUserDataWithManyParameters(firstName, lastName, email, phoneNumber, address, city, state, zipCode) {
    console.log('Processing user:', firstName, lastName);
    return {
        fullName: firstName + ' ' + lastName,
        contact: email,
        location: address + ', ' + city + ', ' + state + ' ' + zipCode
    };
}

function veryLongMethodThatDoesTooManyThings() {
    console.log('Starting complex operation');
    let data = [];

    // Simulate lots of processing
    for (let i = 0; i < 100; i++) {
        data.push(i * 2);
    }

    let result = data.filter(x => x > 50);
    console.log('Filtered data');

    let mapped = result.map(x => ({
        value: x,
        squared: x * x,
        cubed: x * x * x
    }));

    console.log('Mapped data');

    let final = mapped.reduce((acc, item) => {
        if (item.value % 2 === 0) {
            acc.even.push(item);
        } else {
            acc.odd.push(item);
        }
        return acc;
    }, { even: [], odd: [] });

    console.log('Categorized data');

    let stats = {
        total: final.even.length + final.odd.length,
        evenCount: final.even.length,
        oddCount: final.odd.length
    };

    console.log('Calculated stats', stats);

    return {
        data: final,
        stats: stats,
        metadata: {
            processed: true,
            timestamp: new Date(),
            version: '1.0'
        }
    };
}
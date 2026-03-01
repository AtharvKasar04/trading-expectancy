export interface SimulationPath {
    balances: number[];
}

export interface SimulationResult {
    paths: SimulationPath[];
    medianPath: number[];
    numTrades: number;
}

export function runMonteCarloSimulation(
    accountSize: number,
    winRate: number,
    riskPerTrade: number,
    rewardToRisk: number,
    numPaths: number = 50,
    numTrades: number = 240
): SimulationResult {
    const winProb = winRate / 100;
    const risk = riskPerTrade / 100;

    const paths: SimulationPath[] = [];

    for (let p = 0; p < numPaths; p++) {
        const balances: number[] = [accountSize];
        let balance = accountSize;

        for (let t = 0; t < numTrades; t++) {
            if (Math.random() < winProb) {
                balance = balance + balance * risk * rewardToRisk;
            } else {
                balance = balance - balance * risk;
            }
            balance = Math.max(balance, 0);
            balances.push(balance);
        }

        paths.push({ balances });
    }

    const medianPath = computeMedianPath(paths, numTrades);

    return { paths, medianPath, numTrades };
}

function computeMedianPath(paths: SimulationPath[], numTrades: number): number[] {
    const median: number[] = [];

    for (let t = 0; t <= numTrades; t++) {
        const values = paths.map((p) => p.balances[t]).sort((a, b) => a - b);
        const mid = Math.floor(values.length / 2);
        median.push(
            values.length % 2 !== 0
                ? values[mid]
                : (values[mid - 1] + values[mid]) / 2
        );
    }

    return median;
}

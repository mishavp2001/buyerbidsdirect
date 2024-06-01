import '@aws-amplify/ui-react/styles.css'
import MapWithItems from '../components/MapWithItems';
import LoanCalculatorChart from '../components/FinanceCalculator';

function homePage() {
    return (
        <main>         
        <MapWithItems />
        <LoanCalculatorChart />
    </main>
    );
}


export default homePage;




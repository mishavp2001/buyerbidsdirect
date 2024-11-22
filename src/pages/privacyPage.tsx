import { Container, Paper } from "@mui/material";

function privacyPage() {
    return (
        <Container component="main">
         <Paper elevation={3} sx={{ padding: 6 }}>
   
            <p>
                Privacy Policy
                We respect your privacy. We collect and use your information only to provide and improve our services. Your data is never sold or shared with third parties except as required to deliver our services or comply with legal obligations. By using our services, you agree to this policy.
            </p>
        </Paper>
        </Container>
    );
}


export default privacyPage;




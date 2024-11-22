import { Container, Paper } from "@mui/material";

function privacyPage() {
    return (
        <Container component="main">
            <Paper elevation={3} sx={{ padding: 6 }}>
                <p>
                    If you wish to delete your personal data from our website, please follow these instructions:

                    Send an Email Request:
                    Send an email to mishavp2001@yahoo.com with the subject line "Data Deletion Request".

                    Include the Following Information:

                    Your full name.
                    The email address associated with your account.
                    A brief statement confirming that you want all your data deleted.
                    Processing Time:
                    Once we receive your request, we will confirm your identity and process your request within 14 business days.

                    Please note that deleting your data may affect your access to our services. If you have any questions, feel free to contact us at mishavp2001@yahoo.com.

                </p>
            </Paper>
        </Container>
    );
}


export default privacyPage;


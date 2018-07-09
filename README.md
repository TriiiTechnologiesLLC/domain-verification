# domain-verification
Verify domain ownsership, currently supports 3 methods:

1. htmlVerification:
    Verify by uploading a specific HTML to a given domain.
    Parameters:
        domain_url: The URL where the html file can be formed.
        domain_html_name: The name of the html file expected at 'domain_url'
        hash_value: The value in the html file body
    Asssumptions:
        The domain to be verified has the HTML file specified in the url specified by 'domain_url'.
        The filename is of the form: 'domain_html_name'.html, eg. 'domainVerified-1233ask.html'

2. txtVerification:
    Verify by Txt in the DNS of the domain:
    Parameters:
        domain_url: The URL of the domain that has the Txt file added
        domain_key: The Txt key
        domain_value: The Txt value

3. metaTagVerification:
    Verify by metatag information of  a domain:
    Parameters:
        domain_url: The URL of the domain containing the metatag
        domain_key: The meta tag key/name
        domain_value: The value of the meta tag key/name
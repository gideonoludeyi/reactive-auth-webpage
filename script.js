const { fromEvent, of } = rxjs;
const { map, filter, tap, withLatestFrom } = rxjs.operators;
const { isEmail } = validator;

function getPasswordErrorState(text) {
    if (text !== text.trim())
        // extra error state to include
        return 'Password must not contain leading or trailing whitespace';
    if (text.length < 6) return 'Password must be at least 6 characters';
    if (text === text.toLowerCase())
        return 'Password must contain an uppercase character';
    if (text === text.toUpperCase())
        return 'Password must contain a lowercase character';
    if (!/[0-9]+/.test(text)) return 'Password must contain a number';
}

function isValidPassword(text) {
    return !getPasswordErrorState(text);
}

const email = document.getElementById('email-input');
const password = document.getElementById('password-input');
const loginBtn = document.getElementById('login-btn');
const emailHelperText = document.getElementById('email-helper-text');
const passwordHelperText = document.getElementById('password-helper-text');

// emits value of #email-input
const email$ = fromEvent(email, 'input').pipe(map(event => event.target.value));

// emits value of #password-input
const password$ = fromEvent(password, 'input').pipe(
    map(event => event.target.value)
);

// emits values of #email-input and #password-input when both are valid and #login-btn is clicked
const login$ = fromEvent(loginBtn, 'click').pipe(
    withLatestFrom(email$, password$),
    map(([_, email, password]) => ({ email, password })),
    filter(({ email, password }) => isEmail(email) && isValidPassword(password))
);

// update email helper text
email$.subscribe(email => {
    if (!isEmail(email)) {
        emailHelperText.innerHTML = 'Invalid Email';
    } else {
        emailHelperText.innerHTML = '';
    }
});

// update password helper text
password$.subscribe(password => {
    const error = getPasswordErrorState(password);
    if (error) {
        passwordHelperText.innerHTML = error;
    } else {
        passwordHelperText.innerHTML = '';
    }
});

login$.subscribe(({ email }) => {
    alert(`Welcome, ${email}`);
});

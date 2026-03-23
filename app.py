#claude --resume 2f4e95c9-0fec-4bb2-8e99-fbe135d6c306
from flask import Flask, render_template, request, jsonify

app = Flask(__name__)


@app.route('/')
def index():
    return render_template('index.html', active='home')


@app.route('/about')
def about():
    return render_template('about.html', active='about')


@app.route('/our-team')
def team():
    return render_template('team.html', active='about')


@app.route('/why-get-certified')
def why_get_certified():
    return render_template('why_get_certified.html', active='get-certified')


@app.route('/certification-process')
def certification_process():
    return render_template('certification_process.html', active='get-certified')


@app.route('/apply')
def apply():
    return render_template('apply.html', active='apply')


@app.route('/certified-organizations')
def certified_organizations():
    return render_template('certified_organizations.html', active='certified')


@app.route('/verify')
def verify():
    return render_template('verify.html', active='certified')


@app.route('/insights')
def insights():
    return render_template('insights.html', active='insights')


@app.route('/events')
def events():
    return render_template('events.html', active='events')


@app.route('/faq')
def faq():
    return render_template('faq.html', active='faq')


@app.route('/contact')
def contact():
    return render_template('contact.html', active='contact')


# --- API endpoints ---

@app.route('/api/apply', methods=['POST'])
def api_apply():
    # In production: validate, save to DB, send emails
    return jsonify({'success': True})


@app.route('/api/contact', methods=['POST'])
def api_contact():
    return jsonify({'success': True})


@app.route('/api/verify', methods=['POST'])
def api_verify():
    data = request.get_json() or {}
    cert_id = data.get('certificate_id', '').strip().upper()

    # Demo certificate for testing
    demo = {
        'OOC-2026-DEMO-001': {
            'organization': 'Demo Corporation Ltd.',
            'status': 'Valid',
            'year': 2026,
            'country': 'United Kingdom',
            'industry': 'Technology',
        }
    }

    if cert_id in demo:
        return jsonify({'found': True, **demo[cert_id]})

    return jsonify({'found': False})


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)

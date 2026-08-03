import type { AuctionDetailViewModel } from '@/entities/auction'

type ContactsProps = {
  contacts: AuctionDetailViewModel['contacts']
}

export function Contacts({ contacts }: ContactsProps) {
  if (contacts.length === 0) return null

  return (
    <section className="min-w-0" aria-label="Контакты">
      <h2 className="text-sm font-semibold">Контакты</h2>
      <ul className="mt-2 flex min-w-0 flex-col gap-2 text-xs">
        {contacts.map((contact, index) => (
          <li
            key={contact.uid ?? `${contact.phone ?? 'contact'}-${index}`}
            className="min-w-0"
          >
            <p className="font-medium">{contact.name ?? 'Контакт'}</p>
            {contact.phone ? (
              <p className="mt-0.5 text-muted-foreground">{contact.phone}</p>
            ) : null}
            {contact.work_phone ? (
              <p className="text-muted-foreground">{contact.work_phone}</p>
            ) : null}
            {contact.email ? (
              <p className="break-all text-muted-foreground">{contact.email}</p>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  )
}
